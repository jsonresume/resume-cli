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
var customPublish = 'Publish with a custom domain name';
var guestPublish = 'Publish as guest';
var privateCustomPublish = 'Publish privately with a custom domain name. (password access)';
var privateGuestPublish = 'Publish privately as guest. (password access)';



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
    menu.write('        PUBLISH MENU\n');
    menu.write('------------------------------\n');
    menu.add(customPublish);
    menu.add(guestPublish);
    menu.add(privateCustomPublish);
    menu.add(privateGuestPublish);
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.write('\n');
    menu.write('To acquire login details for a custom domain name, EXIT and type.' + ' resume register\n'.white);
    menu.on('select', function(label) {
        menu.close();
        console.log('SELECTED: ' + label);
        callback(label);
    });
    menu.createStream().pipe(process.stdout);
};

function publish(resumeJson, force) {

    publishMenu(function(label) {

        if (label === guestPublish) {
            var guest = true;
            resumeSchema.validate(resumeJson, function(report, errs) {
                if (errs && !force) {
                    test.errorFormatter(errs);
                } else {
                    if (force) {
                        console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                    }
                    spinner.start();
                    publishSend(resumeJson, null, null, guest, false);
                }
            });

        } else if (label === customPublish) {

            console.log('To acquire login details use the command'.cyan, 'resume register');
            console.log('If you already have an account, enter login details:'.cyan);
            read({
                prompt: "email: ",
                default: resumeJson.bio.email.personal
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
                    resumeSchema.validate(resumeJson, function(report, errs) {
                        if (errs && !force) {
                            test.errorFormatter(errs);
                        } else {
                            if (force) {
                                console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                            }
                            spinner.start();
                            publishSend(resumeJson, email, password, false, false);
                        }
                    });
                });
            });
        } else if (label === privateCustomPublish) {
            console.log('')
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
                    console.log('Now enter the password you will give out blah blah blah to access your resume');
                    read({
                        prompt: "resume password: "
                    }, function(er, pProtected) {
                        if (er) {
                            console.log('');
                            process.exit();
                        }
                        resumeSchema.validate(resumeJson, function(report, errs) {
                            if (errs && !force) {
                                test.errorFormatter(errs);
                            } else {
                                if (force) {
                                    console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                                }
                                spinner.start();
                                publishSend(resumeJson, email, password, false, pProtected);
                            }
                        });
                    });
                });
            });

        } else if (label === privateGuestPublish) {

            resumeSchema.validate(resumeJson, function(report, errs) {
                if (errs && !force) {
                    test.errorFormatter(errs);
                } else {
                    console.log('Enter a password for your hosted resume.');
                    read({
                        prompt: "resume password: "
                    }, function(er, pProtected) {
                        if (er) {
                            console.log('');
                            process.exit();
                        }
                        if (force) {
                            console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                        }
                        spinner.start();
                        publishSend(resumeJson, null, null, true, pProtected);
                    });
                }
            });

        } else if (label === 'EXIT') {
            return;
        }
    });

}

function publishSend(resumeJson, email, password, guest, pProtected) {
    request
        .post('http://registry.jsonresume.org/resume')
        .send({
            resume: resumeJson,
            email: email,
            password: password,
            guest: guest,
            pProtected: pProtected
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