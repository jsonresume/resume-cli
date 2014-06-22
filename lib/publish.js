var request = require('superagent');
var open = require('open');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var readline = require('readline');
var test = require('./test');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function publish(resumeData, force) {
    resumeSchema.validate(resumeData, function(report, errs) {
        if (errs && !force) {
            console.log('Error: Resume failed to publish.'.red);
            console.log('Reasons:');
            console.log(test.errorFormatter(errs));
            console.log('For error troubleshooting type:'.cyan, 'resume test');
            console.log('Or to try publish regardless of the error warnings, type:'.cyan, 'resume publish --force');
            process.exit();
        } else {
            if (force) {
                console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
            }
            console.log('publishing...');
            publishSend(resumeData);
        }
    });
}

function publishSend(resumeData) {
    request
        .post('http://beta.jsonresume.org/resume')
        .send({
            resume: resumeData
        })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, res) {

            if (error) {
                console.log(error);
                console.log('There has been an error publishing your resume'.red);
            } else {
                console.log("Success! Your resume is now published at:".green, res.body.url);
                rl.question("Would you like to view your newly published resume in the web browser? (y/n)", function(answer) {
                    if (answer === 'y') {
                        open(res.body.url);
                        rl.close();
                    } else if (answer === 'n') {
                        rl.close();
                    }
                });
            }
        });
    return;
}

module.exports = publish;