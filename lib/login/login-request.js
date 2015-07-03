var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('attempting to login...');
spinner.setSpinnerString('/-\\');
var REGISTRY_SERVER = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var writeConfig = require('./write-config');
var chalk = require('chalk');

module.exports = function loginRequest(userInfo, callback) {

  var url =  REGISTRY_SERVER + '/session';

  callback = callback || function() {}; // for testing

  spinner.start();
  request
    .post(url)
    .send(userInfo)
    .set('Accept', 'application/json')
    .end(function(err, res) {
      console.log(err, res.body);
      spinner.stop();

      if (res.body.message === 'authentication error') {
        console.log('Email or Password incorrect.');
        return callback(err, res);
        return;
      }

      if (err) {
        console.log(chalk.red('There has been an error trying to log you in.'));
        return callback(err, res);
        return;
      }

      if (res.body.message === 'loggedIn') {

        console.log(chalk.green('Success! You are now logged in.'));

        callback(err, res);

        writeConfig({
          username: res.body.username,
          email: res.body.email,
          session: res.body.session
        }, function(success) {
          if (success) {
            console.log('Your user session will be stored in a jsonresume.json config file in your home directory for 7 days.');
          }
        });

      }
    });
  return;
}
