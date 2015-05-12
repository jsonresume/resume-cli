var read = require('read');
var async = require('async');
var menu = require('./menu');
var changeTheme = require('./change-theme');
var changePassword = require('./change-password');
var deleteUser = require('./delete-user');

module.exports = function settings(resumeJson, program, config) {

    var defaultEmail = resumeJson && resumeJson.bio && resumeJson.bio.email && resumeJson.bio.email.personal || '';

    menu.main(function(setting) {

        switch (setting) {
            case 'CHANGE THEME':

                menu.theme(function(theme) {

                    if (typeof config.session !== 'undefined') {
                        changeTheme({
                            email: config.email,
                            password: null,
                            theme: theme,
                            changeTheme: true,
                            session: config.session
                        });
                        return;
                    }

                    read({
                        prompt: "Email: ",
                        default: defaultEmail
                    }, function(err, email) {
                        if (err) {
                            console.log();
                            process.exit();
                        }
                        read({
                            prompt: "Password: ",
                            silent: true
                        }, function(err, password) {
                            if (err) {
                                console.log();
                                process.exit();
                            }

                            changeTheme({
                                email: email,
                                password: password,
                                theme: theme,
                                changeTheme: true
                            });
                        });
                    });
                });


                break;

            case 'CHANGE PASSWORD':

                async.series({
                    email: function(next) {
                        read({
                            prompt: "Email: ",
                            default: defaultEmail
                        }, function(err, email) {

                            next(err, email)
                        });
                    },
                    currentPassword: function(next) {
                        read({
                            prompt: "Current Password: ",
                            silent: true
                        }, function(err, currentPassword) {

                            next(err, currentPassword);
                        });
                    },
                    newPassword: function(next) {
                        read({
                            prompt: "New Password: ",
                            silent: true
                        }, function(err, newPassword) {

                            next(err, newPassword);
                        });
                    },
                    confirmPassword: function(next) {
                        read({
                            prompt: "Confirm Password: ",
                            silent: true
                        }, function(err, confirmPassword) {

                            next(err, confirmPassword);
                        });
                    }
                }, function(err, results) {
                    if (err) {
                        console.log();
                        process.exit();
                    }

                    if (results.newPassword !== results.confirmPassword) {
                        console.log('Your new password does not match the confirmed password. Try again.');
                        process.exit();
                    }

                    changePassword(results);
                });
                break;

            case 'DELETE ACCOUNT':

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

                    read({
                        prompt: 'Are you sure you want to delete your JsonResume.org account? [y/n]: '
                    }, function(err, answer) {
                        if (answer === 'y') {
                            deleteUser(results);
                        } else if (answer === 'n') {
                            process.exit();
                        }
                    });
                });
                break;
        }
    });
};
