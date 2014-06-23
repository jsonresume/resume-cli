#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var init = require('./lib/init');
var test = require('./lib/test');
var publish = require('./lib/publish');
var register = require('./lib/register');
var exportResume = require('./lib/exportResume');
var colors = require('colors');


if (fs.existsSync('./resume.json')) {
    var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
} else {
    resumeData = false;
}

program
    .version('0.0.9')
    .option('-f, --force [force]', 'Force publish [force]', false)

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
        if (resumeData === false) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            test.validate(resumeData);
        }
    });

program
    .command('publish')
    .description('Publish resume.json')
    .action(function() {
        if (resumeData === false) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            publish(resumeData, program.force);
        }
    });

program
    .command('export [fileName]')
    .description('Export int .html, .txt or .pdf')
    .action(function(fileName) {
        if (resumeData === false) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            exportResume(resumeData, fileName);
        }
    });

program
    .command('register')
    .description('register at registry.jsonresume.org')
    .action(function() {
        register();
    });

program.parse(process.argv);

//if run with no commands
if (!program.args.length) {
    console.log('resume-cli'.cyan, '\n');
    console.log('Please type:', 'resume --help'.cyan, 'for information on using resume-cli');
    console.log('or:', 'resume init'.cyan, 'to initialize a new resume.json and start right away.');
    process.exit();
}

//todo
//resume to pdf and markdown
//email already in use validation
// reginster success handeling
// markdown to html
// connect travis mocha script