var read = require('read');
var loginRequest = require('./login-request');
var async = require('async');

module.exports = function login(resumeJson) {

    var defaultEmail = resumeJson && resumeJson.basics.email || '';

    async.series({
        email: function(next) {
            read({
                prompt: "Email: ",
                default: defaultEmail
            }, function(err, email) {

                next(err, email);
            });
        },
        password: function(next) {
            read({
                prompt: "Password: ",
                silent: true
            }, function(err, password) {

                next(err, password);
            });
        }
    }, function(err, results) {
        if (err) {
            console.log();
            process.exit();
        }

        loginRequest(results);
    });
};
