#!/usr/bin/env node

require('dotenv').config();
const pkg = require('./package.json');
const preFlow = require('./lib/pre-flow');
const exportResume = require('./lib/export-resume');
const serve = require('./lib/serve');
const init = require('./lib/init');
const test = require('./lib/test');
const program = require('commander');
const chalk = require('chalk');
const path = require('path');

const normalizeTheme = (value, defaultValue) => {
  const theme = value || defaultValue;
  // TODO - This is not great, but bypasses this function if it is a relative path
  if (theme[0] === '.') {
    return theme;
  }
  return theme.match('jsonresume-theme-.*')
    ? theme
    : `jsonresume-theme-${theme}`;
};

preFlow(async (err, results) => {
  const resumeJson = results.getResume;

  program
    .usage('[command] [options]')
    .version(pkg.version)
    .option(
      '-F, --force',
      'Used by `publish` and `export` - bypasses schema testing.',
    )
    .option(
      '-t, --theme <theme name>',
      'Specify theme used by `export` and `serve` or specify a path starting with . (use . for current directory or ../some/other/dir)',
      normalizeTheme,
      'jsonresume-theme-even',
    )
    .option('-f, --format <file type extension>', 'Used by `export`.')
    .option(
      '-r, --resume <resume filename>',
      'Used by `serve` (default: resume.json)',
      path.join(process.cwd(), 'resume.json'),
    )
    .option('-p, --port <port>', 'Used by `serve` (default: 4000)', 4000)
    .option(
      '-s, --silent',
      'Used by `serve` to tell it if open browser auto or not.',
      false,
    )
    .option(
      '-d, --dir <path>',
      'Used by `serve` to indicate a public directory path.',
      'public',
    )
    .option(
      '--schema <relativePath>',
      'Used by `test` to validate against a custom schema.',
    );

  program
    .command('init')
    .description('Initialize a resume.json file')
    .action(() => {
      init();
    });

  program
    .command('test')
    .description('Schema validation test your resume.json')
    .action(async () => {
      await test(resumeJson);
    });

  program
    .command('export [fileName]')
    .description(
      'Export locally to .html or .pdf. Supply a --format <file format> flag and argument to specify export format.',
    )
    .action((fileName) => {
      exportResume(
        resumeJson,
        fileName,
        program.theme,
        program.format,
        (err, fileName, format) => {
          console.log(
            chalk.green(
              '\nDone! Find your new',
              format,
              'resume at:\n',
              path.resolve(process.cwd(), fileName + format),
            ),
          );
        },
      );
    });

  program
    .command('serve')
    .description('Serve resume at http://localhost:4000/')
    .action(() => {
      serve(
        program.port,
        program.theme,
        program.silent,
        program.dir,
        program.resume,
      );
    });

  await program.parseAsync(process.argv);

  const validCommands = program.commands.map((cmd) => {
    return cmd._name;
  });

  // https://github.com/tj/commander.js/blob/master/CHANGELOG.md#testing-for-no-arguments
  if (program.rawArgs.length < 3) {
    console.log(chalk.cyan('resume-cli:'), 'https://jsonresume.org', '\n');
    program.help();
  } else if (validCommands.indexOf(process.argv[2]) === -1) {
    console.log(chalk.red('Invalid argument:'), process.argv[2]);
    console.log(chalk.cyan('resume-cli:'), 'https://jsonresume.org', '\n');
    program.help();
  }
});
