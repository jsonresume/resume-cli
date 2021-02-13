#!/usr/bin/env node

import 'dotenv/config';

import init from './init';
import getResume from './get-resume';
import getSchema from './get-schema';
import validate from './validate';

const pkg = require('../package.json');
const exportResume = require('./export-resume');
const serve = require('./serve');
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

(async () => {
  program
    .name('resume')
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
      "path to the resume in json format. Use '-' to read from stdin",
      'resume.json',
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
      '-T, --type <mime type>',
      'Specify the mime type of the resume file.',
    )
    .option(
      '--schema <relativePath>',
      'Used by `validate` to validate against a custom schema.',
    );

  program
    .command('init')
    .description('Initialize a resume.json file')
    .action(async () => {
      await init({ resumePath: program.resume });
    });

  program
    .command('validate')
    .description("Validate your resume's schema")
    .action(async () => {
      const resume = await getResume({ path: program.resume, mime: program.mime });
      const schema = await getSchema({ path: program.schema });
      try {
        await validate({
          resume,
          schema,
        });
      } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
      }
    });

  program
    .command('export [fileName]')
    .description(
      'Export locally to .html or .pdf. Supply a --format <file format> flag and argument to specify export format.',
    )
    .action(async (fileName) => {
      const resume = await getResume({ path: program.resume, mime: program.mime });
      exportResume(
        { ...program, resume, fileName },
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
    .action(async () => {
      await serve({
        ...program,
        resumeFilename: program.resume,
      });
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
})();
