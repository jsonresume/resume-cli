var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;

var read = require('read');

var chalk = require('chalk');

var open = require('open');
var publish = require('./publish');

function settings(resumeJson, program, config) {

    mainMenu(function(setting) {
        switch (setting) {

            case 'CHANGE THEME':

                themeMenu(function(theme) {
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
                        default: resumeJson.bio && resumeJson.bio.email && resumeJson.bio.email.personal || ''
                    }, function(er, email) {
                        if (er) {
                            console.log();
                            process.exit();
                        }
                        read({
                            prompt: "Password: ",
                            silent: true
                        }, function(er, password) {
                            if (er) {
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

                read({
                    prompt: "Email: ",
                    default: resumeJson.bio && resumeJson.bio.email && resumeJson.bio.email.personal || ''
                }, function(er, email) {
                    if (er) {
                        console.log();
                        process.exit();
                    }
                    read({
                        prompt: "Current Password: ",
                        silent: true
                    }, function(er, currentPassword) {
                        if (er) {
                            console.log();
                            process.exit();
                        }
                        read({
                            prompt: "New Password: ",
                            silent: true
                        }, function(er, newPassword) {
                            if (er) {
                                console.log();
                                process.exit();
                            }
                            read({
                                prompt: "Confirm Password: ",
                                silent: true
                            }, function(er, confirmPassword) {
                                if (er) {
                                    console.log();
                                    process.exit();
                                }

                                if (newPassword !== confirmPassword) {
                                    console.log('Your new password does not match the confirmed password. Try again.');
                                    process.exit();
                                } else {
                                    changePassword({
                                        email: email,
                                        currentPassword: currentPassword,
                                        newPassword: newPassword,
                                        confirmPassword: confirmPassword
                                    });
                                }
                            });
                        });
                    });
                });


                break;
            case 'DELETE ACCOUNT':

                read({
                    prompt: "Email: ",
                    default: resumeJson.bio && resumeJson.bio.email && resumeJson.bio.email.personal || ''
                }, function(er, email) {
                    if (er) {
                        console.log();
                        process.exit();
                    }
                    read({
                        prompt: "Password: ",
                        silent: true
                    }, function(er, password) {
                        if (er) {
                            console.log();
                            process.exit();
                        }
                        deleteUser({
                            email: email,
                            password: password
                        });
                    });
                });

                break;
        }
    });
}

function changeTheme(themeCredentials) {
    var spinner = new Spinner('changing theme...');
    spinner.setSpinnerString('/-\\');
    spinner.start();
    request
        .put(registryServer + '/resume')
        .send(themeCredentials)
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, res) {
            spinner.stop();
            // console.log(error, res);
            // cannot read property of null
            if (error && error.code === 'ENOTFOUND') {
                console.log('\nThere has been an error publishing your resume.'.red);
                console.log('Please check your network connection.'.cyan);
                process.exit();
                return;
            } else if (error || res.body.message === 'ERRORRRSSSS') {
                console.log(error, res.body.message);
                console.log('\nThere has been an error publishing your resume.'.red);
                // console.log('Details:', error, res.body.message);
                console.log('Please check you are using correct login details.'.blue);
            } else {

                console.log(chalk.green('\nDone! Your resume theme has been successfully changed to ' + themeCredentials.theme + '.'));
                read({
                    prompt: 'Would you like to view your new themed resume in the web browser? [y/n]: '
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

function changePassword(passwordCredentials) {
    var spinner = new Spinner('changing password...');
    spinner.setSpinnerString('/-\\');

    spinner.start();
    request
        .put(registryServer + '/account')
        .send(passwordCredentials)
    // .set('X-API-Key', 'foobar')
    .set('Accept', 'application/json')
        .end(function(error, res) {
            spinner.stop();
            console.log(error, res)
            // cannot read property of null
            if (error && error.code === 'ENOTFOUND') {
                console.log('\nThere has been an error publishing your resume.'.red);
                console.log('Please check your network connection.'.cyan);
                process.exit();
                return;
            } else if (error || res.body.message === 'ERRORRRSSSS') {

                console.log('\nThere has been an error publishing your resume.'.red);
                // console.log('Details:', error, res.body.message);
                console.log('Please check you are using correct login details.'.blue);
            } else {
                console.log('\nYour account password has been successfully updated.');
                console.log(res.body);
                console.log(res.body.message);
            }
        });
    return;
}

function deleteUser(deleteCredentials) {
    var spinner = new Spinner('deleting account...');
    spinner.setSpinnerString('/-\\');
    read({
        prompt: 'Are you sure you want to delete your JsonResume.org account? [y/n]: '
    }, function(er, answer) {
        if (answer === 'y') {

            spinner.start();
            request
                .del(registryServer + '/account')
                .send(deleteCredentials)
            // .set('X-API-Key', 'foobar')
            .set('Accept', 'application/json')
                .end(function(error, res) {
                    // console.log(error, res);
                    spinner.stop();
                    // cannot read property of null
                    if (error && error.code === 'ENOTFOUND') {
                        console.log('\nThere has been an error publishing your resume.'.red);
                        console.log('Please check your network connection.'.cyan);
                        process.exit();
                        return;
                    } else if (res.body.message) {
                        console.log(res.body.message);
                    }
                });
            return;


        } else if (answer === 'n') {
            process.exit();
        }
    });

}

function mainMenu(callback) {
    var menu = require('terminal-menu')({
        width: 29,
        x: 4,
        y: 2,
        bg: 'black',
        fg: 'cyan'
    });
    menu.reset();
    menu.write('SETTINGS\n');
    menu.write('-------------------------\n');
    menu.add('CHANGE THEME');
    menu.add('CHANGE PASSWORD');
    menu.add('DELETE ACCOUNT');
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.on('select', function(setting) {
        menu.close();
        console.log('SELECTED: ' + setting);
        if (setting === 'EXIT') {
            return;
        }
        callback(setting);
    });
    menu.createStream().pipe(process.stdout);
}

function themeMenu(callback) {
    var menu = require('terminal-menu')({
        width: 29,
        x: 4,
        y: 2,
        bg: 'black',
        fg: 'cyan'
    });
    menu.reset();
    menu.write('SETTINGS\n');
    menu.write('-------------------------\n');
    menu.add('flat');
    menu.add('modern');
    menu.add('elegant');
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.on('select', function(theme) {
        menu.close();
        console.log('SELECTED: ' + theme);
        if (theme === 'EXIT') {
            return;
        }
        callback(theme);
    });
    menu.createStream().pipe(process.stdout);
}

module.exports = settings;