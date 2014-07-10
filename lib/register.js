var read = require('read');
var fs = require('fs');
var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('registering...');
spinner.setSpinnerString('/-\\');
// var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var registryServer = 'http://localhost:5000';

function validUserName(userName) {
    var re = /^[^_-][a-zA-Z0-9\-_]{2,30}$/;
    return re.test(userName);
}

function validEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function register(resumeJson) {

    defaultEmail = '';
    if (resumeJson) {
        defaultEmail = resumeJson.bio.email.personal;
    }

    console.log('What username would like to reserve? Your resume will be available at registry.jsonresume.org/{username}:'.cyan);
    read({
        prompt: "username: "
    }, function(er, user) {
        if (!validUserName(user)) {
            console.log('Username may only contain alphanumeric characters, underscores or dashes and cannot begin with a dash or underscore.'.red);
            process.exit();
        }
        if (er) {
            console.log('');
            process.exit();
        }
        read({
            prompt: "email: ",
            default: defaultEmail
        }, function(er, email) {
            if (!validEmail(email)) {
                console.log('Email format is invalid.'.red);
                process.exit();
            }
            if (er) {
                console.log('');
                process.exit();
            }
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
                    verify({
                        username: user,
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

function verify(userInfo) {
    if (!userInfo.passMatch) {
        console.log('Your passwords did not match, try again.'.red);
    } else {
        attemptPost(userInfo);
    }
}

function attemptPost(userInfo) {
    spinner.start();
    request
        .post(registryServer + '/user')
        .send(userInfo)
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, response) {
            spinner.stop();
            console.log();
            // console.log(response.body); //if success. 
            if (error) {
                console.log(error);
                console.log('There has been an error publishing your resume'.red);
            } else if (response.body.message === 'success') {

                console.log(response.body);
                // console.log(response.body.email);
                writeConfig({
                    username: response.body.username,
                    email: response.body.email
                });


                console.log('Success! You have registered:'.green, 'http://registry.jsonresume.org/' + userInfo.username);
                console.log('You can now type: `resume publish` to publish your resume to this domain.');



            } else if (response.body.error && response.body.error.field === 'email') {
                // console.log(response.body.error.message.red) // change the response message
                console.log('Email already in use, please use a different one.'.red);
                read({
                    prompt: "enter a different email: "
                }, function(er, email) {
                    if (er) {
                        console.log();
                        process.exit();
                    }

                    userInfo.email = email;
                    attemptPost(userInfo);
                });
            } else if (response.body.error && response.body.error.field === 'username') {
                read({
                    prompt: "enter a different username: "
                }, function(er, username) {
                    if (er) {
                        console.log();
                        process.exit();
                    }
                    userInfo.username = username;
                    attemptPost(userInfo);
                });
            }
            // console.log();
        });
    return;
}
module.exports = register;



function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function writeConfig(authObj) {
    fs.writeFileSync(getUserHome() + '/.jsonresume', JSON.stringify(authObj, undefined, 2));
}