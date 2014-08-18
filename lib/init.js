var fs = require('fs');
var read = require('read');
var resumeJson = require('resume-schema').resumeJson;
var chalk = require('chalk'); // slowly replace colors with chalk

function fillInit(resumePath) {
    console.log('\nThis utility will generate the resume file ' + resumePath + '.');
    console.log('Fill out your name and email to get started, or leave the fields blank.');
    console.log('All fields are optional.\n');
    console.log('Press ^C at any time to quit.');

    read({
        prompt: 'name: '
    }, function(er, name) {
        if (er) {
            console.log();
            process.exit();
        }

        read({
            prompt: 'email: '
        }, function(er, email) {
            if (er) {
                console.log();
                process.exit();
            }

            resumeJson.basics.name = name;
            resumeJson.basics.email = email;

            fs.writeFileSync(resumePath, JSON.stringify(resumeJson, undefined, 2));

            console.log('\nYour resume.json has been created!'.green);
            console.log('');
            console.log('To generate a formatted .html .md .txt or .pdf resume from your resume.json');
            console.log('type: `resume export [someFileName]` including file extension eg: `resume export myresume.html`');
            console.log('\nYou can optionally specify an available theme for html and pdf resumes using the --theme flag.');
            console.log('Example: `resume export myresume.pdf --theme flat`');
            console.log('Or simply type: `resume export` and follow the prompts.');
            process.exit();
            callback(true);
        });
    });
}

function init(resumePath) {
    if (fs.existsSync(resumePath)) {
        console.log(chalk.yellow('There resume file ' + resumePath + ' already exists.'));
        read({
            prompt: 'Do you want to override? [y/n]:'
        }, function(er, answer) {
            if (er) {
                console.log();
                process.exit();
            }
            if (answer === 'y') {
                fillInit(resumePath);
            } else {
                process.exit();
            }
        });

    } else {
        fillInit(resumePath);
    }
}

module.exports = init;

//todo: fix success wording
