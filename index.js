#!/usr/bin/env node

require('dotenv').load({silent: true});
var pkg = require(__dirname + '/package.json');
var lib = require(__dirname + '/lib');
var program = require('commander');
var colors = require('colors');
var chalk = require('chalk');
var read = require('read');
var path = require('path');

lib.preFlow(function(err, results) {

  var resumeJson = results.getResume;
  var config = results.getConfig;

  program
    .usage("[command] [options]")
    .version(pkg.version)
    .option('-t, --theme <theme name>', 'Specify theme for export or publish (modern, crisp, flat: default)', 'flat')
    .option('-F, --force', 'Used by `publish` - bypasses schema testing.')
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
    .command('register')
    .description('Register an account at https://registry.jsonresume.org')
    .action(function() {
      lib.register(resumeJson);
    });

  program
    .command('login')
    .description('Stores a user session.')
    .action(function() {
      lib.login(resumeJson);
    });

  program
    .command('settings')
    .description('Change theme, change password, delete account.')
    .action(function() {
      lib.settings(resumeJson, program, config);
    });

  program
    .command('test')
    .description('Schema validation test your resume.json')
    .action(function() {
      lib.test.validate(resumeJson, function(error, response) {
        error && console.log(response.message);
      });
    });

  program
    .command('export [fileName]')
    .description('Export locally to .html or .pdf. Supply a --format <file format> flag and argument to specify export format.')
    .action(function(fileName) {
      lib.exportResume(resumeJson, fileName, program, function(err, fileName, format) {
        console.log(chalk.green('\nDone! Find your new', format, 'resume at:\n', path.resolve(process.cwd(), fileName + format)));
      });
    });

  program
    .command('publish')
    .description('Publish your resume to https://registry.jsonresume.org')
    .action(function() {
      lib.publish(resumeJson, program, config);
    });

  program
    .command('serve')
    .description('Serve resume at http://localhost:4000/')
    .action(function() {
      lib.serve(program.port, program.theme, program.silent, program.dir, program.resume);
    });

  program.parse(process.argv);

  var validCommands = program.commands.map(function(cmd) {
    return cmd._name;
  });

  if (!program.args.length) {
    console.log('resume-cli:'.cyan, 'http://jsonresume.org', '\n');
    program.help();

  } else if (validCommands.indexOf(process.argv[2]) === -1) {
    console.log('Invalid argument:'.red, process.argv[2]);
    console.log('resume-cli:'.cyan, 'http://jsonresume.org', '\n');
    program.help();
  }
});
