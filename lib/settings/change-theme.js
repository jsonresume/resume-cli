var request = require('superagent');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('changing theme...');
spinner.setSpinnerString('/-\\');
var read = require('read');
var chalk = require('chalk');
var open = require('open');

module.exports = function changeTheme(payLoad, callback) {
  callback = callback || function() {};

  payLoad.changeTheme = true;

  spinner.start();
  request
    .put(registryServer + '/resume')
    .send(payLoad)
    .set('Accept', 'application/json')
    .end(function(error, res) {
      spinner.stop();

      callback(error, res);

      if (error && error.code === 'ENOTFOUND') {
        console.log(chalk.red('\nThere has been an error publishing your resume.'));
        console.log('Please check your network connection.');
        process.exit();
      } else if (error || res.body.message === 'ERRORRRSSSS') {
        // TODO fix server response
        console.log(error, res.body.message);
        console.log(chalk.red('\nThere has been an error publishing your resume.'));
        // console.log('Details:', error, res.body.message);
        console.log('Check you are using correct login details.');
      } else if (Object.keys(res.body).length === 0) {

        // invalid session
        // TODO fix server response
        // remove session details from config
        console.log(chalk.red('\nInvalid user session.'));
        console.log('Please try again and you will be prompted to enter your email and password');
        process.exit();

      } else {

        console.log(chalk.green('\nDone! Your resume theme has been successfully changed to ' + payLoad.theme + '.'));
        console.log(chalk.green('And the changes have been published to:'), res.body.url);

        read({
          prompt: 'Would you like to view your newly themed resume in the web browser? [y/n]: '
        }, function(er, answer) {
          if (answer === 'y' && res.body.url) {
            open(res.body.url);
            process.exit();
          } else if (answer === 'n') {
            process.exit();
          }
        });

      }
    });
};
