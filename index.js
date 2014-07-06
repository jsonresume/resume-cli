#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var lib = require('./lib')
var colors = require('colors');
var chalk = require('chalk');

function readFileFunction(callback) {
    var resumeJson = require('resume-schema').resumeJson;
    var readFileErrors = null; // change this
    if (fs.existsSync('./resume.json')) {
        fs.readFile('./resume.json', {
            encoding: 'utf8'
        }, function(err, data) {
            if (err) console.log(err);
            try {
                resumeJson = JSON.parse(data);
                callback(resumeJson, null);
            } catch (readFileErrors) {
                callback(null, readFileErrors);
            }
        });
    } else {
        callback(null, null);
    }
}

program
    .version('0.0.9')
    .option('-t, --theme <theme name>', 'Specify theme for export or publish (modern, traditional, crisp)', 'modern')
    .option('-f, --force', 'Force publish - bypasses schema testing.')

program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function() {
        lib.init();
    });

program
    .command('test')
    .description('Schema validation test your resume.json')
    .action(function() {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            readFileFunction(function(resumeJson, readFileErrors) {
                lib.test.validate(resumeJson, readFileErrors, function(error, response) {
                    error && console.log(response.message);
                });
            });
        }
    });

program
    .command('export [fileName]')
    .description('Export locally to .html, .md or .pdf')
    .action(function(fileName) {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {

            readFileFunction(function(resumeJson, readFileErrors) {

                lib.test.validate(resumeJson, readFileErrors, function(error, response) {

                    if (error) {
                        console.log(response.message);

                    } else {
                        lib.exportResume(resumeJson, fileName, program.theme, function(res, fileName) {
                            //do nothing
                        });
                    }
                });
            });

        }
    });

program
    .command('register')
    .description('register an account at https://registry.jsonresume.org')
    .action(function() {
        readFileFunction(function(resumeJson, readFileErrors) {
            lib.register(resumeJson);
        });
    });

program
    .command('publish')
    .description('Publish your resume to https://registry.jsonresume.org')
    .action(function() {


        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {


            readFileFunction(function(resumeJson, readFileErrors) {

                lib.test.validate(resumeJson, readFileErrors, function(error, response) {

                    if (error && !program.force) {
                        console.log(response.message);
                    } else {
                        lib.publish(resumeJson, program);
                    }
                });
            });
        }
    });

program
    .command('settings')
    .description('settings........')
    .action(function() {
        readFileFunction(function() {
            lib.settings(program);
        });
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

//publish errors that are unhandled with broken but passing resume.json test with old resume
// write propper tests
// resume doesn't handle test errors on 'resume publish' properly.  
// what is wrong with resume to pdf
// or resume test is not running before publish as it should
// create man page from md