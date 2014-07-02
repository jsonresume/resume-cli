var fs = require('fs');
var read = require('read');
var resumeJson = require('resume-schema').resumeJson;
var chalk = require('chalk'); // slowly replace colors with chalk

function fillInit() {
    console.log('Fill out some basic details to generate a new resume.json'.cyan);

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

            resumeJson.bio.firstName = name;
            resumeJson.bio.email.personal = email;

            fs.writeFileSync(process.cwd() + '/resume.json', JSON.stringify(resumeJson, undefined, 2));

            console.log('About to write to'.cyan, process.cwd() + '/resume.json', '\n');
            console.log(resumeJson);
            console.log('Done! Your resume.json file is located at:'.green, process.cwd() + '/resume.json');
            console.log('To generate a formatted .html .md .txt or .pdf resume from your resume.json'.cyan);
            console.log('type:'.cyan, 'resume export [your file name]', 'including file extension eg:'.cyan, 'resume export myresume.html');
            console.log('Or just type'.cyan, 'resume export', 'and follow the prompts.'.cyan);
            console.log('Or to publish your resume at:'.cyan, 'http://jsonresume.org', 'Simply type the command:'.cyan, 'resume publish');
            process.exit();
            callback(true);

        });
    });
};

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
};

module.exports = init;

//todo: fix success wording