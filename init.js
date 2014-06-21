var readline = require('readline');
var fs = require('fs');
var async = require('async');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var resume = {
    "name": "1",
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

var seriesArray = [

    function(callback) {
        rl.question("name: ", function(name) {
            resume.name = name;
            callback();
        });
    },
    function(callback) {
        rl.question("email: ", function(email) {
            resume.email = email;
            callback()
        });
    },
    function(callback) {
        rl.question("github: ", function(github) {
            resume.profiles.github = github;
            fs.writeFileSync(__dirname + '/resume.json', JSON.stringify(resume));
            // console.log(resume);
            callback();
            rl.close();
            console.log('Success! Please find and complete your generated resume.json file at:'.green, __dirname + '/resume.json');
            console.log('To publish your resume at'.blue, 'http://jsonresume.org', 'simply type the command'.blue, 'node index publish (resume publish)');
        });
    }
];

function init() {
    console.log("Please fill out some basic details to generate a new resume.json".blue);
    async.series(seriesArray);
}
module.exports = init;

//todo
// github integration