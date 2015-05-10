var validate = require('./validate');
var registerUser = require('./registerUser');
var read = require('read');
var async = require('async');

module.exports = function(resumeJson) {

    defaultEmail = '';
    if (resumeJson) {
        defaultEmail = resumeJson.basics.email || '';
    }

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
            read({
                prompt: "email: ",
                default: defaultEmail
            }, function(err, email) {
                //pressing ctrl+c will still run email vailidation check before exiting, change this.
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
    }, function(err, results) {
        if (err) {
            console.log('');
            process.exit();
        }

        read({
            prompt: "re-enter password: ",
            silent: true
        }, function(err, password) {

            validate.password(results.password, password);

            registerUser(results);
        });
    });
};
