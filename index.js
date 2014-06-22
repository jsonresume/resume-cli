#!/usr/bin/env node

var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var program = require('commander');
var fs = require('fs');
var init = require('./lib/init');
var test = require('./lib/test');
var publish = require('./lib/publish');
var colors = require('colors');


var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));

program
    .version('0.0.1')
    .option('-f, --format [format]', 'Add the specified format of file [format]', 'html')
    .option('--force [force]', 'Force publish [force]', false);

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
    .description('Publish resume.json')
    .action(function(fileName) {

        console.log(fileName);
    });


program.parse(process.argv);
var argumentZero = program.args[0];


if (!program.args.length) {
    console.log(' \n ');
    console.log('Please type:', 'resume --help'.cyan, 'for information on using resume-cli');
    console.log('or:', 'resume init'.cyan, 'to initialize a new resume.json and start right away.');
    process.exit();
}


var resumeOutput = 'resume';


if (program.format === 'html') {

    if (!resumeOutput) {
        // resumeOutput = argumentZero.replace("json", "html");
        resumeOutput = 'resume.html';
    }
    resumeToHtml(resumeData, function(TextResume) {
        fs.writeFileSync(resumeOutput, TextResume, 'utf8');
    });

}

// else if (program.format === 'txt') {

//     if (!resumeOutput) {
//         resumeOutput = argumentZero.replace("json", "txt");;
//     }
//     resumeToText(resumeData, function(TextResume) {
//         fs.writeFileSync(resumeOutput, TextResume, 'utf8');
//     });

// }