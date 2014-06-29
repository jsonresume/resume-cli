var read = require('read');
var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('registering...');
spinner.setSpinnerString('/-\\');

function validEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function register(resumeJson) {
    console.log('What username would like to reserve? Your resume will be available at registry.jsonresume.org/{username}:'.cyan);
    read({
        prompt: "username: "
    }, function(er, user) {
        if (er) {
            console.log('');
            process.exit();
        }
        read({
            prompt: "email: ",
            default: resumeJson.bio.email.personal
        }, function(er, email) {
            if (!validEmail(email)) {
                console.log('Incorrect email format. Try again.'.red);
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
        .post('http://registry.jsonresume.org/user')
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
                console.log('Success! You are now registered at jsonresume.org.'.green);
                console.log('You can now type'.cyan, 'resume publish --username (todo)');
                console.log('to publish your resume at the custom domain you just created'.cyan);
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