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
    .option('-f, --force', 'Force publish', false)

program
    .command('init')
    .description('Initialize a resume.json file')
    .action(function() {
        lib.init();
    });

program
    .command('test')
    .description('Test resume.json')
    .action(function() {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            readFileFunction(function(resumeJson, readFileErrors) {
                lib.test.validate(resumeJson, readFileErrors, function(error) {
                    // console.log(error);
                });
            });
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

            readFileFunction(function(resumeJson, readFileErrors) {
                lib.test.validate(resumeJson, readFileErrors, function(error) {
                    if (error) {
                        console.log(chalk.red('  Cannot export, errors in resume.json.'))
                        console.log('  Details: \n');
                    } else {
                        lib.exportResume(resumeJson, fileName, function(res, fileName) {
                            //do nothing
                        });
                    }
                });
            });

        }
    });

program
    .command('register')
    .description('register at registry.jsonresume.org')
    .action(function() {
        readFileFunction(function(resumeJson, readFileErrors) {
            lib.register(resumeJson);
        });
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

program.parse(process.argv);

var validCommands = program.commands.map(function(cmd) {
    return cmd._name;
});

if (!program.args.length) {
    console.log('resume-cli:'.cyan, 'http://jsonresume.org', '\n');
    program.help();
    process.exit();
} else if (validCommands.indexOf(process.argv[2]) === -1) {
    console.log('Invalid argument:'.red, process.argv[2]);
    console.log('resume-cli:'.cyan, 'http://jsonresume.org', '\n');
    program.help();
    process.exit();
}

//todo.
// publish with no network connection error handling
// remove phantom.js to pdf thing
// export not working with new schema