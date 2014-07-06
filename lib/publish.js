var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
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
var customPublish = 'Publish to your account.';
var guestPublish = 'Publish as guest.';
var encriptedCustom = 'Publish to your account (password access).';
var encriptedGuest = 'Publish as guest (password access).';

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
    menu.add(encriptedCustom);
    menu.add(encriptedGuest);
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.write('\n');
    menu.write('To acquire account details, press ^C and type: `resume register`\n'.white);
    menu.write('Or just publish as guest.'.white);
    menu.on('select', function(label) {
        menu.close();
        console.log('\nSELECTED: ' + label);
        callback(label);
    });
    menu.createStream().pipe(process.stdout);
};

function publish(resumeJson, program) {
    force = program.force;

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
                    publishSend(resumeJson, program.theme, null, null, guest, false);
                }
            });

        } else if (label === customPublish) {

            console.log('\nTo acquire login details use the command: `resume register`');
            console.log('If you already have an account, enter your login details below:');
            read({
                prompt: "email: ",
                default: resumeJson.bio && resumeJson.bio.email && resumeJson.bio.email.personal || ''
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
                            publishSend(resumeJson, program.theme, email, password, false, false);
                        }
                    });
                });
            });
        } else if (label === encriptedCustom) {
            console.log('\nTo acquire login details use the command: `resume register`');
            console.log('If you already have an account, enter your login details below:');
            read({
                prompt: "email: ",
                default: resumeJson.bio && resumeJson.bio.email && resumeJson.bio.email.personal || ''
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
                    console.log('Now enter the password you will give out for private access to your published resume.');
                    read({
                        prompt: "resume password: "
                    }, function(er, passphrase) {
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
                                publishSend(resumeJson, program.theme, email, password, false, passphrase);
                            }
                        });
                    });
                });
            });

        } else if (label === encriptedGuest) {

            resumeSchema.validate(resumeJson, function(report, errs) {
                if (errs && !force) {
                    test.errorFormatter(errs);
                } else {
                    console.log('\nEnter a password for your hosted resume.');
                    console.log('This is the password you will give out for access to your published resume.');
                    read({
                        prompt: "resume password: "
                    }, function(er, passphrase) {
                        if (er) {
                            console.log('');
                            process.exit();
                        }
                        if (force) {
                            console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
                        }
                        spinner.start();
                        publishSend(resumeJson, program.theme, null, null, true, passphrase);
                    });
                }
            });

        } else if (label === 'EXIT') {
            return;
        }
    });

}

function publishSend(resumeJson, theme, email, password, guest, passphrase) {
    request
        .post(registryServer + '/resume')
        .send({
            resume: resumeJson,
            theme: theme,
            email: email,
            password: password,
            guest: guest,
            passphrase: passphrase
        })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, res) {
            // cannot read property of null
            if (error && error.code === 'ENOTFOUND') {
                console.log('\nThere has been an error publishing your resume.'.red);
                console.log('Please check your network connection.'.cyan);
                process.exit();
                return;
            } else if (error || res.body.message === 'ERRORRRSSSS') {
                spinner.stop();
                console.log('\nThere has been an error publishing your resume.'.red);
                // console.log('Details:', error, res.body.message);
                console.log('Please check you are using correct login details.'.blue);
            } else {
                spinner.stop();
                console.log("\nSuccess! Your resume is now published at:".green, res.body.url);
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