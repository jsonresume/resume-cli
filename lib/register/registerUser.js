var request = require('superagent');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var writeConfig = require('./writeConfig');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('registering...');
spinner.setSpinnerString('/-\\');

var read = require('read');


module.exports = function registerUser(userInfo) {

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

                console.log('Success! You have registered:'.green, 'http://registry.jsonresume.org/' + userInfo.username);
                console.log('You can now type: `resume publish` to publish your resume to this domain.');
                // console.log(response.body);
                // console.log(response.body.email);
                writeConfig({
                    username: response.body.username,
                    email: response.body.email
                }, function(success) {
                    if (success) {
                        console.log('Your user session has been saved in the jsonresume.json config file in your home directory.');
                    }
                });

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
                    registerUser(userInfo);
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
                    registerUser(userInfo);
                });
            }
            // console.log();
        });
    return;
}
