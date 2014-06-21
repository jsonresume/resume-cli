#!/usr/bin/env node

var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var program = require('commander');
var fs = require('fs');

var init = require('./init');
var validate = require('./validate');
var publish = require('./publish');

program
    .version('0.0.1')
    .option('-f, --format [format]', 'Add the specified format of file [format]', 'html')
    .parse(process.argv);

// console.log('program.format', program.format);

var argumentZero = program.args[0];
var resumeOutput = program.args[1];
var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));

switch (argumentZero) {
    case 'init':
        init();
        break;
    case 'test':
        validate(function(isOrNot, why) {
            console.log(isOrNot);
            console.log(why);
        });
        break;
    case 'publish':
        publish(resumeData);
        break;
    default:
        //default code block
        break;
}


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