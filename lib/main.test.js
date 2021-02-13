import { spawn, exec as execCB } from 'child_process';
import streamToString from 'stream-to-string';
import { promisify } from 'util';
import packageJson from '../package.json';

const exec = promisify(execCB);

const run = async (argv, { waitForVolumeExport = true, stdin = '' } = {}) => {
  let volume;
  let exitCode;
  const child = spawn(
    process.execPath,
    ['build/test-utils/cli-test-entry.js', ...argv],
    {
      stdio: ['pipe', 'pipe', 2, 'ipc'],
    },
  );
  const allChecks = Promise.all([
    waitForVolumeExport
      ? new Promise((volumeSet) => {
          child.on('message', async (message) => {
            if (message.type === 'volumeExport') {
              volume = message.data;
              volumeSet();
            }
          });
        })
      : true,
    new Promise((processExited) => {
      child.on('exit', (code) => {
        exitCode = code;
        processExited();
      });
    }),
  ]);
  child.stdin.write(stdin);
  child.stdin.end();
  const stdout = await streamToString(child.stdout);
  await allChecks;
  return {
    volume,
    code: exitCode,
    stdout,
  };
};

describe('cli configuration', () => {
  beforeAll(() => exec(packageJson.scripts.prepare));
  it('should show help', async () => {
    const { stdout } = await run(['help'], { waitForVolumeExport: false });
    expect(stdout).toMatchInlineSnapshot(`
      "Usage: resume [command] [options]

      Options:
        -V, --version                       output the version number
        -F, --force                         Used by \`publish\` and \`export\` - bypasses
                                            schema testing.
        -t, --theme <theme name>            Specify theme used by \`export\` and
                                            \`serve\` or specify a path starting with .
                                            (use . for current directory or
                                            ../some/other/dir) (default:
                                            \\"jsonresume-theme-even\\")
        -f, --format <file type extension>  Used by \`export\`.
        -r, --resume <resume filename>      path to the resume in json format. Use
                                            '-' to read from stdin (default:
                                            \\"resume.json\\")
        -p, --port <port>                   Used by \`serve\` (default: 4000) (default:
                                            4000)
        -s, --silent                        Used by \`serve\` to tell it if open
                                            browser auto or not. (default: false)
        -d, --dir <path>                    Used by \`serve\` to indicate a public
                                            directory path. (default: \\"public\\")
        -T, --type <mime type>              Specify the mime type of the resume file.
        --schema <relativePath>             Used by \`validate\` to validate against a
                                            custom schema.
        -h, --help                          display help for command

      Commands:
        init                                Initialize a resume.json file
        validate                            Validate your resume's schema
        export [fileName]                   Export locally to .html or .pdf. Supply
                                            a --format <file format> flag and
                                            argument to specify export format.
        serve                               Serve resume at http://localhost:4000/
        help [command]                      display help for command
      "
    `);
  });
  describe('validate', () => {
    it('should use the schema override arg', async () => {
      const { stdout } = await run([
        'validate',
        '--schema',
        '/test-resumes/only-number-schema.json',
        '--resume',
        '/test-resumes/only-number.json',
      ]);
      expect(stdout).toMatchInlineSnapshot(`""`);
    });
    it('should fail when trying to validate an invalid resume specified by the --resume option', async () => {
      expect(
        (
          await run([
            'validate',
            '--resume',
            '/test-resumes/invalid-resume.json',
          ])
        ).code,
      ).toEqual(1);
    });
    it('should validate a resume specified by the --resume option', async () => {
      const { stdout } = await run([
        'validate',
        '--resume',
        '/test-resumes/resume.json',
      ]);
      expect(stdout).toMatchInlineSnapshot(`""`);
    });
  });
  describe('export', () => {
    it('should read from stdin when path is a dash', async () => {
      const { stdout, volume } = await run(
        [
          'export',
          '/test-resumes/exported-resume-from-stdin.html',
          '--resume',
          '-', // this is the dash
        ],
        { stdin: JSON.stringify({ basics: { name: 'thomas-from-stdin' } }) },
      );
      expect(volume['/test-resumes/exported-resume-from-stdin.html']).toEqual(
        expect.stringContaining('thomas-from-stdin'),
      );
      expect(stdout).toMatchInlineSnapshot(`
        "
        Done! Find your new .html resume at:
         /test-resumes/exported-resume-from-stdin.html
        "
      `);
    });
    it('should export a resume from the path specified by --resume to the path specified immediately after the export command', async () => {
      const { stdout } = await run([
        'export',
        '/test-resumes/exported-resume.html',
        '--resume',
        '/test-resumes/resume.json',
      ]);
      expect(stdout).toMatchInlineSnapshot(`
        "
        Done! Find your new .html resume at:
         /test-resumes/exported-resume.html
        "
      `);
    });
  });
});
