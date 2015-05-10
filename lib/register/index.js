var registerUser = require('./registerUser');
var writeConfig = require('./writeConfig');
var validate = require('./validate');
var read = require('read');
var fs = require('fs');
var async = require('async');

function register(resumeJson) {

    defaultEmail = '';
    if (resumeJson) {
        defaultEmail = resumeJson.basics.email || '';
    }

    console.log('What username would like to reserve? Your resume will be available at registry.jsonresume.org/{username}:'.cyan);

	read({
        prompt: "username: "
    }, function(er, username) {
        if (er) {
            console.log('');
            process.exit();
        }
        validate.username(username);

        read({
            prompt: "email: ",
            default: defaultEmail
        }, function(er, email) {
            if (er) {
                console.log('');
                process.exit();
            }
            validate.email(email);

            read({
                prompt: "password: ",
                silent: true
            }, function(er, pass) {
                if (er) {
                    console.log('');
                    process.exit();
                }
                read({
                    prompt: "re-enter password: ",
                    silent: true
                }, function(er, pass2) {

                    validate.password(pass, pass2);

                    registerUser({
                        username: username,
                        email: email,
                        password: pass,
                        verify: pass2,
                        passMatch: (pass === pass2)
                    });
                });
            });
        });
    });
}



module.exports = register;
