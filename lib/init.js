var fs = require('fs');
var read = require('read');

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


    console.log('Fill out some basic details to generate a new resume.json'.cyan);

    read({
        prompt: 'name: '
    }, function(er, name) {
        read({
            prompt: 'email: '
        }, function(er, email) {
            resume.email = email;
            resume.name = name;
            fs.writeFileSync(process.cwd() + '/resume.json', JSON.stringify(resume, undefined, 2));

            console.log('About to write to'.cyan, process.cwd() + '/resume.json', '\n');
            console.log(resume);
            console.log('Success! Your resume.json file is located at:'.green, process.cwd() + '/resume.json');
            console.log('To generate a nicely formatted .html .txt or .pdf resume from your resume.json'.cyan);
            console.log('type:'.cyan, 'resume export [file name]', 'eg:'.cyan, 'resume export myresume.html');
            console.log('Or to publish your resume at:'.cyan, 'http://jsonresume.org', 'Simply type the command:'.cyan, 'resume publish');
            process.exit();

        });
    });

}

module.exports = init;