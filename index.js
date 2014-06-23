#!/usr/bin/env node

var resumeJson = {
    "name": "dd",
    "email": "1",
    "phoneNumber": "1",
    "bio": "",
    "location": {
        "city": "1",
        "countryCode": "",
        "state": "1"
    },
    "work": [{
        "startDate": "",
        "endDate": "",
        "position": "",
        "name": "",
        "website": "http://www..com",
        "description": "",
        "highlights": [""]
    }],
    "education": [{
        "name": "",
        "studyType": "",
        "area": "",
        "startDate": "",
        "endDate": "",
        "courses": ["", ""]
    }],
    "awards": [{
        "name": "",
        "date": "",
        "awarder": ""
    }],
    "publications": [{
        "name": "",
        "publisher": ""
    }],
    "profiles": {
        "github": "1",
        "twitter": ""
    },
    "skills": ["", ""],
    "hobbies": [""],
    "references": [{
        "name": "",
        "reference": ""
    }]
};
var program = require('commander');
var fs = require('fs');
var init = require('./lib/init');
var test = require('./lib/test');
var publish = require('./lib/publish');
var register = require('./lib/register');
var exportResume = require('./lib/exportResume');
var colors = require('colors');

if (fs.existsSync('./resume.json')) {
    resumeJson = JSON.parse(fs.readFileSync('./resume.json', 'utf8'));
}

program
    .version('0.0.9')
    .option('-f, --force [force]', 'Force publish [force]', false)

program
    .command('init')
    .description('Initialize resume.json')
    .action(function() {
        init(resumeJson);
    });

program
    .command('test')
    .description('Test resume.json')
    .action(function() {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            test.validate(resumeJson);
        }
    });

program
    .command('publish')
    .description('Publish resume.json')
    .action(function() {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            publish(resumeJson, program.force);
        }
    });

program
    .command('export [fileName]')
    .description('Export int .html, .txt or .pdf')
    .action(function(fileName) {
        if (!fs.existsSync('./resume.json')) {
            console.log('There is no resume.json file located in this directory'.yellow);
            console.log('Type:'.cyan, 'resume init', 'to initialize a new resume'.cyan);
        } else {
            exportResume(resumeJson, fileName);
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