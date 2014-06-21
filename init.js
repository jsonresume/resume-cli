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

function init() {
    console.log("initializing resume.json...");
    async.series([

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
                console.log(resume);
                callback();
                rl.close();
            });
        }
    ]);
}
module.exports = init;

//todo
// test function successful
// validate publish, everything
// github