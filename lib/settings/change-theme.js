var request = require('superagent');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('changing theme...');
spinner.setSpinnerString('/-\\');
var read = require('read');

module.exports = function changeTheme(themeCredentials) {

    spinner.start();
    request
        .put(registryServer + '/resume')
        .send(themeCredentials)
        .set('Accept', 'application/json')
        .end(function(error, res) {
            spinner.stop();
            if (error && error.code === 'ENOTFOUND') {
                console.log('\nThere has been an error publishing your resume.'.red);
                console.log('Please check your network connection.'.cyan);
                process.exit();
            } else if (error || res.body.message === 'ERRORRRSSSS') {
                console.log(error, res.body.message);
                console.log('\nThere has been an error publishing your resume.'.red);
                // console.log('Details:', error, res.body.message);
                console.log('Please check you are using correct login details.'.blue);
            } else {

                console.log(chalk.green('\nDone! Your resume theme has been successfully changed to ' + themeCredentials.theme + '.'));
                read({
                    prompt: 'Would you like to view your new themed resume in the web browser? [y/n]: '
                }, function(er, answer) {
                    if (answer === 'y') {
                        open(res.body.url);
                        process.exit();
                    } else if (answer === 'n') {
                        process.exit();
                    }
                });

            }
        });
};
