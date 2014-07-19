var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var request = require('superagent');
var open = require('open');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var chalk = require('chalk');
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
        if (label === 'EXIT') {
            return;
        } else {
            callback(label);
        }
    });
    menu.createStream().pipe(process.stdout);
};

function publish(resumeJson, program, config) {


    // if (force) {
    //         console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
    //     }

    // if (error && !program.force) {
    //     console.log(response.message);

    force = program.force;

    publishMenu(function(label) {
        if (label === guestPublish) {
            publishSend(resumeJson, program.theme, null, null, true, false, null);
        } else if (label === customPublish) {

            if (typeof config.session !== 'undefined') {
                publishSend(resumeJson, program.theme, config.email, null, false, false, config.session);
                return;

            } else {
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
                        publishSend(resumeJson, program.theme, email, password, false, false, null);
                    });
                });
            }
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
                        publishSend(resumeJson, program.theme, email, password, false, passphrase, config.session);
                    });
                });
            });
        } else if (label === encriptedGuest) {
            console.log('\nEnter a password for your hosted resume.');
            console.log('This is the password you will give out for access to your published resume.');
            read({
                prompt: "resume password: "
            }, function(er, passphrase) {
                if (er) {
                    console.log('');
                    process.exit();
                }
                publishSend(resumeJson, program.theme, null, null, true, passphrase, null);
            });
        }
    });
}


// function sessionPublish(resumeJson, program, session) {
//     force = program.force;
//     publishMenu(function(label) {
//         switch (label) {
//             case guestPublish:
//                 publishSend(resumeJson, program.theme, null, null, true, false);
//                 break;
//             case customPublish:
//                 publishSend(resumeJson, program.theme, email, password, false, false);
//                 break;
//             case encriptedCustom:
//                 publishSend(resumeJson, program.theme, email, password, false, passphrase);
//                 break;
//             case encriptedGuest:
//                 publishSend(resumeJson, program.theme, null, null, true, passphrase);
//                 break;
//         }
//     });
// }


function publishSend(resumeJson, theme, email, password, guest, passphrase, session) {
    // console.log({
    //     resume: resumeJson,
    //     theme: theme,
    //     email: email,
    //     password: password,
    //     guest: guest,
    //     passphrase: passphrase,
    //     session: session
    // });
    spinner.start();
    request
        .post(registryServer + '/resume')
        .send({
            resume: resumeJson,
            theme: theme,
            email: email,
            password: password,
            guest: guest,
            passphrase: passphrase,
            session: session
        })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, res) {
            spinner.stop();
            // cannot read property of null
            if (res.body.sessionError) {
                console.log('\n', chalk.red(res.body.sessionError));
                console.log('Your session details are out of date or invalid. Please type `resume login` to renew your session.');
                return;

            } else if (error && error.code === 'ENOTFOUND') {
                console.log('\nThere has been an error publishing your resume.'.red);
                console.log('Please check your network connection.'.cyan);
                process.exit();
                return;
            } else if (error || res.body.message === 'ERRORRRSSSS') {

                console.log(error, registryServer);
                console.log('\nThere has been an error publishing your resume.'.red);
                // console.log('Details:', error, res.body.message);
                console.log('Please check you are using correct login details.'.blue);
            } else {

                // console.log(res.body);
                console.log("\nSuccess! Your resume is now published at:".green, res.body.url);

                if (process && process.platform !== 'win32') {

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
            }
        });
    return;
}

module.exports = publish;

//network connection error handling