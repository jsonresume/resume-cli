var read = require('read');
var request = require('superagent');

function register(resumeJson) {
    console.log('What username would like to reserve, your resume will be available at registry.jsonresume.org/{username}:'.cyan);
    read({
        prompt: "username: "
    }, function(er, user) {
        if (er) {
            console.log('');
            process.exit();
        }
        read({
            prompt: "email: ",
            default: resumeJson.email
        }, function(er, email) {
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
                    // console.error("the program should exit now")
                })
            })
        })
    })
}

function verify(userInfo) {
    if (!userInfo.passMatch) {
        console.log('Your passwords did not match, try again.'.red);
    } else {
        attemptPost(userInfo);
    }
}

module.exports = register;

function attemptPost(userInfo) {
    request
        .post('http://registry.jsonresume.org/user')
        .send(userInfo)
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, response) {
            console.log(response.body);
            if (error) {
                // spinner.stop();
                console.log(error);
                // console.log('There has been an error publishing your resume'.red);
            } else if (response.body.error && response.body.error.field === 'email') {
                read({
                    prompt: "enter a different email: "
                }, function(er, email) {
                    userInfo.email = email;
                    attemptPost(userInfo);
                });

            } else if (response.body.error && response.body.error.field === 'username') {
                read({
                    prompt: "enter a different username: "
                }, function(er, username) {
                    userInfo.username = username;
                    attemptPost(userInfo);
                });

            }
        });
    return;
}