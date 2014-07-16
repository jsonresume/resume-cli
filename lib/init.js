var fs = require('fs');
var read = require('read');
var resumeJson = require('resume-schema').resumeJson;
var chalk = require('chalk'); // slowly replace colors with chalk



function fillInit() {
    console.log('\nThis utility will generate a resume.json file in your current working directory.');
    console.log('Fill out your name and email to get started, or leave the fields blank.');
    console.log('All fields are optional.\n');
    console.log('Press ^C at any time to quit.');

    read({
        prompt: 'firstName: '
    }, function(er, fname) {
        if (er) {
            console.log();
            process.exit();
        }

        read({
            prompt: 'lastName: '
        }, function(er, lname) {
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

                resumeJson.bio.firstName = fname;
                resumeJson.bio.lastName = lname;
                resumeJson.bio.email.personal = email;

                resumeJson.work[0] = {
                    company: 'Facebook',
                    position: 'Software Engineer',
                    website: 'http://facebook.com',
                    startDate: '2014-06-29',
                    endDate: '2012-06-29',
                    summary: 'Give an overview of your responsibilities at the company',
                    highlights: ['Increased profits by 20% from 2011-2012 through viral advertising']
                }

                fs.writeFileSync(process.cwd() + '/resume.json', JSON.stringify(resumeJson, undefined, 2));

                console.log('About to write to'.cyan, process.cwd() + '/resume.json', '\n');
                console.log(resumeJson);
                console.log('\nDone! Your resume.json file is located at:'.green, process.cwd() + '/resume.json');
                console.log('To generate a formatted .html .md .txt or .pdf resume from your resume.json');
                console.log('type: `resume export [someFileName]` including file extension eg: `resume export myresume.html`');
                console.log('\nYou can optionally specify an available theme for html and pdf resumes using the --theme flag.');
                console.log('Example: `resume export myresume.pdf --theme modern`');
                console.log('Or simply type: `resume export` and follow the prompts.');
                // console.log('\nTo publish your resume at:', 'http://jsonresume.org', 'Simply type the command: resume publish');
                process.exit();
                callback(true);

            });
        });
    });
}

function init() {
    if (fs.existsSync('./resume.json')) {
        console.log(chalk.yellow('There is already a resume.json file in this directory.'));
        read({
            prompt: 'Do you want to override? [y/n]:'
        }, function(er, answer) {
            if (er) {
                console.log();
                process.exit();
            }
            if (answer === 'y') {
                fillInit();
            } else {
                process.exit();
            }
        });

    } else {
        fillInit();
    }
}

module.exports = init;

//todo: fix success wording