var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('attempting to login...');
spinner.setSpinnerString('/-\\');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var writeConfig = require('./write-config');

module.exports = function loginUser(userInfo, callback) {

    console.log(userInfo);
    callback = callback || function() {}; // for testing
console.log(registryServer+ '/session');
    spinner.start();
    request
        .post(registryServer + '/session')
        .send(userInfo)
        .set('Accept', 'application/json')
        .end(function(err, res) {
            spinner.stop();
            console.log(err, res.body);
            callback(err, res);

            console.log();
            // console.log(res.body); //if success.
            if (err) {
                console.log(err);
                console.log('There has been an error trying to log you in.'.red);
            } else if (res.body.message === 'loggedIn') {

                console.log('Success! You are now logged in.'.green);
                // console.log(res.body);
                // console.log(res.body.message);

                writeConfig({
                    username: res.body.username,
                    email: res.body.email,
                    session: res.body.session
                }, function(success) {
                    if (success) {
                        console.log('Your user session will be stored in a jsonresume.json config file in your home directory for 7 days.');
                    }
                });

            } else if ('authentication error') {
                console.log('authentication error');
            }
        });
    return;
}
