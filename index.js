#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var init = require('./lib/init');
var test = require('./lib/test');
var publish = require('./lib/publish');
var register = require('./lib/register');
var colors = require('colors');
var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var html5pdf = require("html5-to-pdf");

if (fs.existsSync('./resume.json')) {
    var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
} else {
    resumeData = {};
}

program
    .version('0.0.4')
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
        console.log('fjdkls')
        exports(resumeData, fileName);
    });

program
    .command('register')
    .description('register at registry.jsonresume.org')
    .action(function() {
        register();
    });

program.parse(process.argv);

// if resume is run with no commands
if (!program.args.length) {

    console.log('resume-cli'.cyan, '\n');
    console.log('Please type:', 'resume --help'.cyan, 'for information on using resume-cli');
    console.log('or:', 'resume init'.cyan, 'to initialize a new resume.json and start right away.');
    process.exit();
}

function exports(resumeData, fileName) {

    splitFileName = fileName.split('.');
    var fileExtension = splitFileName[1];

    if (!fileName) {
        console.log("Please provide a file name for your resume");
        console.log("");
        process.exit();

        // } else if (splitFileName.length === ) {
        //     console.log('Please enter a valid file extexions (.html .txt .pdf)');
    }

    switch (fileExtension) {

        case 'html':
            resumeToHtml(resumeData, function(htmlResume) {

                fs.writeFileSync(fileName, htmlResume, 'utf8');

                console.log('Done! Please find your generated .html resume at:'.green, process.cwd() + '/resume.html');
                process.exit();
            });
            break;
        case 'txt':
            resumeToText(resumeData, function(txtResume) {
                fs.writeFileSync(fileName, txtResume, 'utf8');
                console.log('Done! Please find your generated .html resume at:'.green, process.cwd() + '/resume.json');
                process.exit();
            });
            break;
        case 'pdf':
            resumeToHtml(resumeData, function(htmlResume) {
                fs.writeFileSync(fileName, htmlResume, 'utf8');

                html5pdf().from(splitFileName[0] + '.html').to(splitFileName[0] + '.pdf', function() {
                    console.log('Done! Please find your generated .html resume at:'.green, process.cwd() + '/resume.json');
                    process.exit();

                })
            });
            break;
    }
}