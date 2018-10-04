#!/usr/bin/env node

require('dotenv').config();
var pkg = require('./package.json');
var lib = require('./lib');
var program = require('commander');
var chalk = require('chalk');
var path = require('path');

function normalizeTheme(value, defaultValue) {
  const theme = value || defaultValue;
  return theme.match('jsonresume-theme-.*') ? theme : `jsonresume-theme-${theme}`;
}

lib.preFlow(async function(err, results) {

  var resumeJson = results.getResume;
  var config = results.getConfig;

  program
    .usage("[command] [options]")
    .version(pkg.version)
    .option('-t, --theme <theme name>', 'Specify theme used by `export` (modern, crisp, even: default)', normalizeTheme, 'even')
    .option('-f, --format <file type extension>', 'Used by `export`.')
    .option('-r, --resume <resume filename>', 'Used by `serve` (default: resume.json)', path.join(process.cwd(), 'resume.json'))
    .option('-p, --port <port>', 'Used by `serve` (default: 4000)', 4000)
    .option('-s, --silent', 'Used by `serve` to tell it if open browser auto or not.', false)
    .option('-d, --dir <path>', 'Used by `serve` to indicate a public directory path.', 'public');

  program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function() {
      lib.init()
    });

  program
    .command('test')
    .description('Schema validation test your resume.json')
    .action(async function() {
      await lib.test(resumeJson);
    });

  program
    .command('export [fileName]')
    .description('Export locally to .html or .pdf. Supply a --format <file format> flag and argument to specify export format.')
    .action(function(fileName) {
      lib.exportResume(resumeJson, fileName, program.theme, program.format, function(err, fileName, format) {
        console.log(chalk.green('\nDone! Find your new', format, 'resume at:\n', path.resolve(process.cwd(), fileName + format)));
      });
    });

  program
    .command('serve')
    .description('Serve resume at http://localhost:4000/')
    .action(function() {
      lib.serve(program.port, program.theme, program.silent, program.dir, program.resume);
    });

  await program.parseAsync(process.argv);

  var validCommands = program.commands.map(function(cmd) {
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
