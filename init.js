var readline = require('readline');
var fs = require('fs');

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
    console.log("init resume.json");
    rl.question("name: ", function(name) {
        resume.name = name;

        rl.question("email: ", function(email) {
            resume.email = email;

            rl.question("phone number: ", function(ph) {
                resume.phoneNumber = ph;

                rl.question("city: ", function(city) {
                    resume.location.city = city;

                    rl.question("state: ", function(state) {
                        resume.location.state = state;

                        rl.question("github: ", function(github) {
                            resume.profiles.github = github;


                            fs.writeFileSync(__dirname + '/resume.json', JSON.stringify(resume));
                            console.log(resume);

                            rl.close();
                        });
                    });
                });
            });
        });
    });
}
module.exports = init;