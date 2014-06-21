var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var request = require('superagent');
var open = require('open');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function publish(resumeData) {
    resumeSchema.validate(resumeData, function(report, errs) {

        if (errs) {
            console.log('error publishing resume'.red);
            console.log(errs);

            console.log("Please type 'force' to ignore your formatting errors and publish anyway".yellow);
            rl.question("or anything else to quit.".yellow, function(answer) {
                if (answer === 'force') {
                    publishSend(resumeData);
                } else {
                    return;
                }
            });
        } else {

            publishSend(resumeData);
        }
    });
}
module.exports = publish;

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
                console.log("Congratulations! Your resume is now published at:".green, res.body.url);
                rl.question("Would you like to view your newly published resume in the web browser? (yes/no)".yellow, function(answer) {
                    if (answer === 'yes') {
                        open(res.body.url);

                    } else {
                        rl.close();
                    }
                });
            }
        });
    return;
}