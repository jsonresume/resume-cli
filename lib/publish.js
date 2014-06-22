var request = require('superagent');
var open = require('open');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var read = require('read');
var test = require('./test');
var menu = require('terminal-menu')({
    width: 29,
    x: 4,
    y: 2,
    bg: 'black',
    fg: 'cyan'
});



var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('publishing..');
spinner.setSpinnerString('/-\\');

function publish(resumeData, force) {

    menu.reset();
    menu.write('PUBLISH MENU\n');
    menu.write('-------------------------\n');
    menu.add('guest');
    menu.add('Publish user');
    menu.add('EXIT');

    menu.on('select', function(label) {
        menu.close();
        console.log('SELECTED: ' + label);

        if (label === 'guest') {
            var guest = true;
            resumeSchema.validate(resumeData, function(report, errs) {
                if (errs && !force) {
                    console.log('Error: Resume failed to publish.'.red);
                    console.log('Reasons:');
                    console.log(errs);
                    // console.log(test.errorFormatter(errs));
                    console.log('For error troubleshooting type:'.cyan, 'resume test');
                    console.log('Or to try to nppublish regardless of the error warnings, type:'.cyan, 'resume publish --force');
                    process.exit();
                } else {
                    if (force) {
                        console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                    }
                    spinner.start();
                    publishSend(resumeData, null, null, guest);
                }
            });

        } else {

            console.log('To acquire login details use the command'.cyan, 'resume register');
            console.log('Enter login details:'.cyan);
            read({
                prompt: "email: "
            }, function(er, email) {
                read({
                    prompt: "password: "
                }, function(er, password) {

                    resumeSchema.validate(resumeData, function(report, errs) {
                        if (errs && !force) {
                            console.log('Error: Resume failed to publish.'.red);
                            console.log('Reasons:');
                            console.log(errs);
                            // console.log(test.errorFormatter(errs));
                            console.log('For error troubleshooting type:'.cyan, 'resume test');
                            console.log('Or to try to nppublish regardless of the error warnings, type:'.cyan, 'resume publish --force');
                            process.exit();
                        } else {
                            if (force) {
                                console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                            }
                            spinner.start();
                            publishSend(resumeData, email, password, guest);
                        }
                    });
                });
            });
        }
    });

    menu.createStream().pipe(process.stdout);





}

function publishSend(resumeData, email, password, guest) {



    request
        .post('http://registry.jsonresume.org/resume')
        .send({
            resume: resumeData,
            email: email,
            password: password,
            guest: guest
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
                console.log("Success! Your resume is now published at:".green, email, password, res.body);
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