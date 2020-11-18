#!/usr/bin/env node

require('dotenv').config();
const pkg = require('./package.json');
const lib = require('./lib');
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

lib.preFlow(async (err, results) => {
  const resumeJson = results.getResume;

  program
    .usage('[command] [options]')
    .version(pkg.version)
    .option(
      '-t, --theme <theme name>',
      'Specify theme used by `export` and `serve` (default: even) or specify a path starting with . (use . for current directory or ../some/other/dir)',
      normalizeTheme,
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
      lib.init();
    });

  program
    .command('test')
    .description('Schema validation test your resume.json')
    .action(async () => {
      await lib.test(resumeJson);
    });

  program
    .command('export [fileName]')
    .description(
      'Export locally to .html or .pdf. Supply a --format <file format> flag and argument to specify export format.',
    )
    .action((fileName) => {
      lib.exportResume(
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
      lib.serve(
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
