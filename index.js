#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var lib = require('./lib')
var colors = require('colors');
var resumeJson = require('resume-schema').resumeJson;

if (fs.existsSync('./resume.json')) {
    resumeJson = JSON.parse(fs.readFileSync('./resume.json', 'utf8'));
}

program
    .version('0.0.9')
    .option('-f, --force [force]', 'Force publish [force]', false)

program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function() {
        lib.init(resumeJson, function(res) {
            // to nothing
        });
    });

program
    .command('test')
    .description('Test resume.json')
    .action(function() {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            lib.test.validate(resumeJson);
        }
    });

program
    .command('publish')
    .description('Publish resume.json at:')
    .action(function() {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            lib.publish(resumeJson, program.force);
        }
    });

program
    .command('export [fileName]')
    .description('Export locally to .html, .txt or .pdf')
    .action(function(fileName) {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            lib.exportResume(resumeJson, fileName, function(res, fileName) {
                //do nothing
            });
        }
    });

program
    .command('register')
    .description('register at registry.jsonresume.org')
    .action(function() {
        lib.register(resumeJson);
    });

program.parse(process.argv);

//if run with invalid args. will break on resume export resume.html
if (typeof program.args[0] === 'string') {
    console.log('resume-cli'.cyan, 'http://jsonresume.org', '\n');
    program.help();
    process.exit();
    //if run with no commands
} else if (!program.args.length) {
    console.log('resume-cli'.cyan, 'http://jsonresume.org', '\n');
    program.help();
    process.exit();
}

//todo.
//menu for just resume
//resume to pdf and markdown
// markdown to html
// what username format?

//check if export the same filename if replace