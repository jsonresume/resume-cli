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
var lib = require('./lib')
var colors = require('colors');

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
        lib.init(resumeJson, function(res){
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
            lib.exportResume(resumeJson, fileName, function(res, fileName){
                console.log(res);
                console.log('Done! Find your generated .html**fix resume at:'.green, process.cwd() + '/' + fileName);
                console.log('To publish your resume at:'.cyan, 'http://jsonresume.org', 'Type the command:'.cyan, 'resume publish');
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

//if run with invalid args
if (typeof program.args[0] === 'string') {
    console.log('resume-cli'.cyan, 'http://jsonresume.org', '\n');
    console.log(program.help());
    process.exit();
    //if run with no commands
} else if (!program.args.length) {
    console.log('resume-cli'.cyan, 'http://jsonresume.org', '\n');
    console.log(program.help());
    process.exit();
}

//todo
//resume to pdf and markdown
//email already in use validation
// reginster success handeling
// markdown to html
// connect travis mocha script

//check if export the same filename if replace