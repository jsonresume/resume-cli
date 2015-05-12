var request = require('superagent');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('deleting account...');
spinner.setSpinnerString('/-\\');

module.exports = function deleteUser(user, callback) {
    var callback = callback || function() {};

    spinner.start();
    request
        .del(registryServer + '/account')
        .send(user)
        .set('Accept', 'application/json')
        .end(function(err, res) {
            spinner.stop();

            if (err) {
                console.log(err);
                callback(err);
                process.exit();
            }
            if (err && err.code === 'ENOTFOUND') {
                console.log('\nThere has been an error deleting your jsonResume account.'.red);
                console.log('Please check your network connection.'.cyan);
				callback(err);
                process.exit();

            } else if (res.body.message) {
                console.log(res.body.message);
				callback(null, res.body.message);
            }
        });
};
