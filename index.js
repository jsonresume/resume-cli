#!/usr/bin/env node

var open = require('open');
var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var program = require('commander');
var fs = require('fs');
var request = require('superagent');
var init = require('./init');
var validate = require('./validate');
program
    .version('0.0.1')
    .option('-f, --format [format]', 'Add the specified format of file [format]', 'html')
    .parse(process.argv);

// console.log('program.format', program.format);

var resumeInput = program.args[0];

var resumeOutput = program.args[1];

if (resumeInput === 'init') {
    init();
} else if (resumeInput === 'test') {
    validate();
} else if (resumeInput === 'publish') {
    if (validate()) {
        var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
        request
            .post('http://beta.jsonresume.org/resume')
            .send({
                resume: resumeData
            })
            .set('X-API-Key', 'foobar')
            .set('Accept', 'application/json')
            .end(function(error, res) {
                console.log(res.body);
                open(res.body.url);
            });
        return;
    }

} else if (program.format === 'html') {

    var resumeData = JSON.parse(fs.readFileSync(resumeInput, 'utf8'));
    if (!resumeOutput) {
        resumeOutput = resumeInput.replace("json", "html");
    }
    resumeToHtml(resumeData, function(TextResume) {
        fs.writeFileSync(resumeOutput, TextResume, 'utf8');
    });

} else if (program.format === 'txt') {
    var resumeData = JSON.parse(fs.readFileSync(resumeInput, 'utf8'));

    if (!resumeOutput) {
        resumeOutput = resumeInput.replace("json", "txt");;
    }
    resumeToText(resumeData, function(TextResume) {
        fs.writeFileSync(resumeOutput, TextResume, 'utf8');
    });

}