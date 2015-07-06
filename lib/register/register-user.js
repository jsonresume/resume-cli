var read = require('read');
var request = require('superagent');
var registryServer = process.env.REGISTRY_SERVER  || 'http://registry.jsonresume.org';
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('registering...');
spinner.setSpinnerString('/-\\');

module.exports = function registerUser(user, callback) {
console.log('registering user');
    spinner.start();
    request
        .post(registryServer + '/user')
        .send(user)
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, response) {
            spinner.stop();
            // console.log(error, response.body.error);
            // console.log(response.body); //if success.
            if (error) {
                // console.log(error);
                console.log('There has been an error publishing your resume'.red);
                callback(error, response);
            } else if (response.body.message === 'success') {

                console.log('Success! You have registered:'.green, 'http://registry.jsonresume.org/' + user.username);
                console.log('You can now type: `resume publish` to publish your resume to this domain.');

                callback(null, {
                    username: response.body.username,
                    email: response.body.email
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

                    user.email = email;
                    registerUser(user);
                });
            } else if (response.body.error && response.body.error.field === 'username') {
                read({
                    prompt: "enter a different username: "
                }, function(er, username) {
                    if (er) {
                        console.log();
                        process.exit();
                    }
                    user.username = username;
                    registerUser(user);
                });
            }
            // console.log();
        });
    return;
}
