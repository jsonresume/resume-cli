#!/usr/bin/env node

var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var program = require('commander');
var fs = require('fs');
var init = require('./init');
var validate = require('./validate');
var publish = require('./publish');

var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));

program
    .version('0.0.1')
    .option('-f, --format [format]', 'Add the specified format of file [format]', 'html') //default to 'html'
.option('--force [force]', 'Force publish [force]', false) //default to 'html'

program
    .command('init')
    .description('Initialize resume.json')
    .action(function() {
        init();
    });

program
    .command('test')
    .description('Initialize resume.json')
    .action(function() {
        validate.validate(resumeData);
    });

program
    .command('publish')
    .description('Initialize resume.json')
    .action(function() {
        publish(resumeData, program.force);
    });



program.parse(process.argv);

var argumentZero = program.args[0];
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