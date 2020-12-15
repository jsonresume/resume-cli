import { exec as execCB } from 'child_process';
import { promisify } from 'util';
import packageJson from '../package.json';

const exec = promisify(execCB);

const run = (argv) =>
  exec(
    [process.execPath, 'build/test-utils/cli-test-entry.js', argv].join(' '),
  );

describe('cli configuration', () => {
  beforeAll(() => exec(packageJson.scripts.prepare));
  it('should show help', async () => {
    expect((await run('help')).stdout).toMatchInlineSnapshot(`
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
        -r, --resume <resume filename>      path to the resume in json format
                                            (default: \\"resume.json\\")
        -p, --port <port>                   Used by \`serve\` (default: 4000) (default:
                                            4000)
        -s, --silent                        Used by \`serve\` to tell it if open
                                            browser auto or not. (default: false)
        -d, --dir <path>                    Used by \`serve\` to indicate a public
                                            directory path. (default: \\"public\\")
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
    it('should fail when trying to validate an invalid resume specified by the --resume option', async () => {
      await expect(
        run('validate --resume /test-resumes/invalid-resume.json'),
      ).rejects.toEqual(
        expect.objectContaining({
          code: 1,
        }),
      );
    });
    it('should validate a resume specified by the --resume option', async () => {
      const output = await run('validate --resume /test-resumes/resume.json');
      expect(output.stdout).toMatchInlineSnapshot(`""`);
      expect(output.stderr).toMatchInlineSnapshot(`""`);
    });
  });
  describe('export', () => {
    it('should export a resume from the path specified by --resume to the path specified immediately after the export command', async () => {
      const output = await run(
        'export /test-resumes/exported-resume.html --resume /test-resumes/resume.json',
      );
      expect(output.stdout).toMatchInlineSnapshot(`
        "
        Done! Find your new .html resume at:
         /test-resumes/exported-resume.html
        "
      `);
      expect(output.stderr).toMatchInlineSnapshot(`""`);
    });
  });
});
