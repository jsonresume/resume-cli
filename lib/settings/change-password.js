var request = require('superagent');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('changing password...');
spinner.setSpinnerString('/-\\');

module.exports = function changePassword(passwordCredentials, callback) {

  callback = callback || function() {};

  spinner.start();
  request
    .put(registryServer + '/account')
    .send(passwordCredentials)
    .set('Accept', 'application/json')
    .end(function(error, res) {

      callback(error, res);

      spinner.stop();
      // cannot read property of null
      if (error && error.code === 'ENOTFOUND') {
        console.log('\nThere has been an error publishing your resume.'.red);
        console.log('Please check your network connection.'.cyan);
        process.exit();
      } else if (error || res.body.message === 'ERRORRRSSSS') {

        console.log('\nThere has been an error publishing your resume.'.red);
        // console.log('Details:', error, res.body.message);
        console.log('Please check you are using correct login details.'.blue);
        process.exit();

      } else {
        console.log('\nYour account password has been successfully updated.');
        console.log(res.body.message);
      }
    });
};
