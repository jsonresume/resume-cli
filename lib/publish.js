var request = require('superagent');
var open = require('open');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var read = require('read');
// var readline = require('readline');
var test = require('./test');
// var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('publishing..');
spinner.setSpinnerString('/-\\');

function publish(resumeData, force) {
    resumeSchema.validate(resumeData, function(report, errs) {
        if (errs && !force) {
            console.log('Error: Resume failed to publish.'.red);
            console.log('Reasons:');
            console.log(test.errorFormatter(errs));
            console.log('For error troubleshooting type:'.cyan, 'resume test');
            console.log('Or to try to nppublish regardless of the error warnings, type:'.cyan, 'resume publish --force');
            process.exit();
        } else {
            if (force) {
                console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
            }
            spinner.start();
            publishSend(resumeData);
        }
    });
}

function publishSend(resumeData) {
    request
        .post('http://registry.jsonresume.org/resume')
        .send({
            resume: resumeData
        })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, res) {

            if (error) {
                spinner.stop();
                console.log(error);
                console.log('There has been an error publishing your resume'.red);
            } else {
                spinner.stop();
                console.log("Success! Your resume is now published at:".green, res.body.url);
                read({
                    prompt: 'Would you like to view your newly published resume in the web browser? (y/n): '
                }, function(er, answer) {
                    if (answer === 'y') {
                        open(res.body.url);
                        process.exit();
                    } else if (answer === 'n') {
                        process.exit();
                    }
                });
            }
        });
    return;
}

module.exports = publish;