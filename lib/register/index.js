var validate = require('./validate');
var registerUser = require('./register-user');
var writeConfig = require('./write-config');
var read = require('read');
var async = require('async');

module.exports = function register(resumeJson) {

    console.log('What username would like to reserve? Your resume will be available at registry.jsonresume.org/{username}:'.cyan);

    async.series({
        username: function(next) {
            read({
                prompt: "username: "
            }, function(err, username) {

                validate.username(username);
                next(err, username);
            });
        },
        email: function(next) {

            var defaultEmail = resumeJson && resumeJson.basics.email || '';

            read({
                prompt: "email: ",
                default: defaultEmail
            }, function(err, email) {

                validate.email(email);
                next(err, email);
            });
        },
        password: function(next) {
            read({
                prompt: "password: ",
                silent: true
            }, function(err, password) {

                next(err, password);
            });
        }
    }, function(err, user) {
        if (err) {
            // this error is usually fired when pressing Ctrl+C
            console.log();
            process.exit();
        }

        read({
            prompt: "re-enter password: ",
            silent: true
        }, function(err, password) {

            validate.passwords(user.password, password);

            registerUser(user, function(err, res) {

                writeConfig({
                    username: res.username,
                    email: res.email
                });
            });
        });
    });
};
