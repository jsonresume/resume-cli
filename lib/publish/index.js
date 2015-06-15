var resumeSchema = require('resume-schema');
var colors = require('colors');
var chalk = require('chalk');
var read = require('read');
var async = require('async');
var test = require('../test');
var menu = require('./menu');
var publishResume = require('./publish-resume');


//publish menu
var customPublish = 'Publish to your account.';
var guestPublish = 'Publish as guest.';
var encriptedCustom = 'Publish to your account (password access).';
var encriptedGuest = 'Publish as guest (password access).';

function logPublishErrors(errs) {
    console.log(chalk.red('Error: Resume failed to publish.'));
    console.log('Reasons:');
    console.log(errs);
    // console.log(test.errorFormatter(errs));
    console.log(chalk.cyan('For error troubleshooting type:'), 'resume test');
    console.log(chalk.cyan('Or to try to publish regardless of the error warnings, type:'), 'resume publish --force');
    process.exit();
};

module.exports = function publish(resumeJson, program, config) {

    var defaultEmail = resumeJson && resumeJson.basics.email || '';


    // if (force) {
    //         console.log('You resume.json did not pass formatting tests. Attempting to publish anyway...'.yellow);
    //     }

    // if (error && !program.force) {
    //     console.log(response.message);

    // force = program.force;

    menu.publish(function(option) {

        switch (option) {

            case guestPublish:

                publishResume(resumeJson, program.theme, null, null, true, false, null);
                break;

            case customPublish:

                if (typeof config.session !== 'undefined') {
                    publishResume(resumeJson, program.theme, config.email, null, false, false, config.session);
                    return;

                } else {
                    console.log('\nTo acquire login details use the command: `resume register`');
                    console.log('If you already have an account, enter your login details below:');
                    read({
                        prompt: "email: ",
                        default: defaultEmail
                    }, function(er, email) {
                        if (er) {
                            console.log();
                            process.exit();
                        }
                        read({
                            prompt: "password: ",
                            silent: true
                        }, function(er, password) {
                            if (er) {
                                console.log();
                                process.exit();
                            }
                            publishResume(resumeJson, program.theme, email, password, false, false, null);
                        });
                    });
                }
                break;

            case encriptedCustom:

                console.log('\nTo acquire login details use the command: `resume register`');
                console.log('If you already have an account, enter your login details below:');

                async.series({
                    email: function(next) {
                        read({
                            prompt: "Email: ",
                            default: defaultEmail
                        }, function(err, email) {

                            next(err, email)
                        });
                    },
                    password: function(next) {
                        read({
                            prompt: "Password: ",
                            silent: true
                        }, function(err, password) {

                            next(err, password);
                        });
                    },
                    resumePassword: function(next) {
                        console.log('Now enter the password you will give out for private access to your published resume.');
                        read({
                            prompt: "Resume Password: "
                        }, function(err, resumePassword) {

                            next(err, resumePassword);
                        });
                    }
                }, function(err, results) {
                    if (err) {
                        console.log();
                        process.exit();
                    }

                    publishResume(resumeJson, program.theme, results.email, results.password, false, results.resumePassword, config.session);
                });
                break;

            case encriptedGuest:

                console.log('\nEnter a password for your hosted resume.');
                console.log('This is the password you will give out for access to your published resume.');
                read({
                    prompt: "resume password: "
                }, function(er, passphrase) {
                    if (er) {
                        console.log();
                        process.exit();
                    }
                    publishResume(resumeJson, program.theme, null, null, true, passphrase, null);
                });
                break;

        }
    });
};

// function sessionPublish(resumeJson, program, session) {
//     force = program.force;
//     publishMenu(function(option) {
//         switch (option) {
//             case guestPublish:
//                 publishResume(resumeJson, program.theme, null, null, true, false);
//                 break;
//             case customPublish:
//                 publishResume(resumeJson, program.theme, email, password, false, false);
//                 break;
//             case encriptedCustom:
//                 publishResume(resumeJson, program.theme, email, password, false, passphrase);
//                 break;
//             case encriptedGuest:
//                 publishResume(resumeJson, program.theme, null, null, true, passphrase);
//                 break;
//         }
//     });
// }
//network connection error handling
