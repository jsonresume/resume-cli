var request = require('superagent');
var open = require('open');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var read = require('read');
var test = require('./test');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('publishing...');
spinner.setSpinnerString('/-\\');

//publish menu
var guestPublish = 'Publish as guest (auto-generated domain name)';
var customPublish = 'Publish with a custom domain name';
var privatePublish = 'Publish your resume privatly. (password access)';

function logPublishErrors(errs) {
    console.log('Error: Resume failed to publish.'.red);
    console.log('Reasons:');
    console.log(errs);
    // console.log(test.errorFormatter(errs));
    console.log('For error troubleshooting type:'.cyan, 'resume test');
    console.log('Or to try to publish regardless of the error warnings, type:'.cyan, 'resume publish --force');
    process.exit();
};

function publishMenu(callback) {
    var menu = require('terminal-menu')({
        width: 35,
        x: 4,
        y: 2,
        bg: 'black',
        fg: 'cyan'
    });
    menu.reset();
    menu.write('PUBLISH MENU\n');
    menu.write('-------------------------\n');
    menu.add(guestPublish);
    menu.add(customPublish);
    menu.add(privatePublish);
    menu.add('EXIT');
    menu.on('select', function(label) {
        menu.close();
        console.log('SELECTED: ' + label);
        callback(label);
    });
    menu.createStream().pipe(process.stdout);
};


function publish(resumeData, force) {

    publishMenu(function(label) {

        if (label === guestPublish) {
            var guest = true;
            resumeSchema.validate(resumeData, function(report, errs) {
                if (errs && !force) {
                    logPublishErrors(errs);
                } else {
                    if (force) {
                        console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                    }
                    spinner.start();
                    publishSend(resumeData, null, null, guest);
                }
            });

        } else if (label === customPublish) {

            console.log('To acquire login details use the command'.cyan, 'resume register');
            console.log('If you already hav an account, enter login details:'.cyan);
            read({
                prompt: "email: "
            }, function(er, email) {
                if (er) {
                    console.log('');
                    process.exit();
                }
                read({
                    prompt: "password: ",
                    silent: true
                }, function(er, password) {
                    if (er) {
                        console.log('');
                        process.exit();
                    }
                    resumeSchema.validate(resumeData, function(report, errs) {
                        if (errs && !force) {
                            logPublishErrors(errs);
                        } else {
                            if (force) {
                                console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                            }
                            spinner.start();
                            publishSend(resumeData, email, password, false);
                        }
                    });
                });
            });
        } else if (label === privatePublish) {

        } else if (label === 'EXIT') {
            return;
        }
    });

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
                console.log("Success! Your resume is now published at:".green, res.body.url);
                read({
                    prompt: 'Would you like to open your newly published resume in the web browser? [y/n]: '
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