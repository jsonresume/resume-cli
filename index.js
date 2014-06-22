#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var init = require('./lib/init');
var test = require('./lib/test');
var publish = require('./lib/publish');
var exportJson = require('./lib/exportJson');
var colors = require('colors');

var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));

program
    .version('0.0.1')
    .option('-f, --force [force]', 'Force publish [force]', false);

program
    .command('init')
    .description('Initialize resume.json')
    .action(function() {
        init();
    });

program
    .command('test')
    .description('Test resume.json')
    .action(function() {
        test.validate(resumeData);
    });

program
    .command('publish')
    .description('Publish resume.json')
    .action(function() {
        publish(resumeData, program.force);
    });

program
    .command('export <fileName>')
    .description('Export int .html, .txt or .pdf')
    .action(function(fileName) {
        exportJson(resumeData, fileName);
    });

program.parse(process.argv);

// var argumentZero = program.args[0];

// if resume is run with no commands
if (!program.args.length) {
    console.log(' \n ');
    console.log('Please type:', 'resume --help'.cyan, 'for information on using resume-cli');
    console.log('or:', 'resume init'.cyan, 'to initialize a new resume.json and start right away.');
    process.exit();
}