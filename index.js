#!/usr/bin/env node

var pkg = require('./package.json');
var lib = require('./lib');
var program = require('commander');
var async = require('async');
var colors = require('colors');
var chalk = require('chalk');
var read = require('read');
var path = require('path');

async.auto(lib['pre-flow'], function(err, results) {

  program
    .usage("[command] [options]")
    .version(pkg.version)
    .option('-t, --theme <theme name>', 'Specify theme for export or publish (modern, traditional, crisp)', 'flat')
    .option('-F, --force', 'Used by `publish` - bypasses schema testing.')
    .option('-f, --format <file type extension>', 'Used by `export`.')
    .option('-p, --port <port>', 'Used by `serve` (default: 4000)', 4000)
    .option('-s, --silent', 'Used by `serve` to tell it if open browser auto or not.', false);

  program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function() {
      lib.init();
    });

  program
    .command('register')
    .description('Register an account at https://registry.jsonresume.org')
    .action(function() {
      lib.register(results.getResume);
    });

  program
    .command('login')
    .description('Stores a user session.')
    .action(function() {
      lib.login();
    });

  program
    .command('settings')
    .description('Change theme, change password, delete account.')
    .action(function() {
      lib.settings(results.getResume, program, results.getConfig);
    });

  program
    .command('test')
    .description('Schema validation test your resume.json')
    .action(function() {
      lib.test.validate(results.getResume, function(error, response) {
        error && console.log(response.message);
      });
    });

  program
    .command('export [fileName]')
    .description('Export locally to .html, .md or .pdf. Supply a --format <file format> flag and argument to specify export format.')
    .action(function(fileName) {
      lib.exportResume(results.getResume, fileName, program, function(err, fileName, format) {
        console.log(chalk.green('\nDone! Find your new', format, 'resume at:\n', path.resolve(process.cwd(), fileName)));
      });
    });

  program
    .command('publish')
    .description('Publish your resume to https://registry.jsonresume.org')
    .action(function() {
      lib.publish(results.getResume, program, results.getConfig);
    });

  program
    .command('serve')
    .description('Serve resume at http://localhost:4000/')
    .action(function() {
      lib.serve(program.port, program.theme, program.silent);
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
