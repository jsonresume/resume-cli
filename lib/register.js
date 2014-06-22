var read = require('read');
var request = require('superagent');


function register() {
    console.log('Fill out some basic details to generate a new resume.json'.cyan);

    read({
        prompt: " What username would like to reserve, your resume will be available at registry.jsonresume.org/{username}: ",
        // default: "test-user"
    }, function(er, user) {
        read({
            prompt: "email: "
        }, function(er, email) {
            read({
                prompt: "password: ",
                // default: "test-pass",
                silent: true
            }, function(er, pass) {
                read({
                    prompt: "re-enter password: ",
                    // default: "test-pass",
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

function verify(data) {
    if (!data.passMatch) {
        console.log('Your passwords did not match, try again.'.red);
    } else {
        attemptPost(data);
    }
}


module.exports = register;


function attemptPost(data) {
    request
        .post('http://registry.jsonresume.org/user')
        .send(data)
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, response) {

            if (error) {
                // spinner.stop();
                console.log(error);
                // console.log('There has been an error publishing your resume'.red);
            } else if (response) {
                // spinner.stop();
                // console.log("Success! Your resume is now published at:".green, res.body.url);
                console.log(response.body);
                console.log("Success! You are registered.".green);
                // read({
                //     prompt: 'Would you like to view your newly published resume in the web browser? (y/n): '
                // }, function(er, answer) {
                //     if (answer === 'y') {
                //         open(res.body.url);
                //         process.exit();
                //     } else if (answer === 'n') {
                //         process.exit();
                //     }
                // });
            }
        });
    return;
}

// request
//     .post('http://registry.jsonresume.org/user')
//     .send({
//         resume: resumeData
//     })
//     .set('X-API-Key', 'foobar')
//     .set('Accept', 'application/json')
//     .end(function(error, res) {

//         if (error) {
//             spinner.stop();
//             console.log(error);
//             console.log('There has been an error publishing your resume'.red);
//         } else {
//             spinner.stop();
//             console.log("Success! Your resume is now published at:".green, res.body.url);
//             read({
//                 prompt: 'Would you like to view your newly published resume in the web browser? (y/n): '
//             }, function(er, answer) {
//                 if (answer === 'y') {
//                     open(res.body.url);
//                     process.exit();
//                 } else if (answer === 'n') {
//                     process.exit();
//                 }
//             });
//         }
//     });
// return;