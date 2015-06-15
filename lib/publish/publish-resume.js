var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('publishing...');
spinner.setSpinnerString('/-\\');
var read = require('read');
var open = require('open');
var chalk = require('chalk');

module.exports = function publishResume(resumeJson, theme, email, password, guest, passphrase, session, callback) {

    var callback = callback || function() {}; // for testing
    // console.log({
    //     resume: resumeJson,
    //     theme: theme,
    //     email: email,
    //     password: password,
    //     guest: guest,
    //     passphrase: passphrase,
    //     session: session
    // });
    spinner.start();
    request
        .post(registryServer + '/resume')
        .send({
            resume: resumeJson,
            theme: theme,
            email: email,
            password: password,
            guest: guest,
            passphrase: passphrase,
            session: session
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
            spinner.stop();
            callback(err, res);
            // cannot read property of null
            if (res.body.sessionError) {
                console.log('\n', chalk.red(res.body.sessionError));
                console.log('Your session details are out of date or invalid. Please type `resume login` to renew your session.');
                return;

            } else if (err && err.code === 'ENOTFOUND') {
                console.log(chalk.red('\nThere has been an error publishing your resume.'));
                console.log(chalk.cyan('Please check your network connection.'));
                process.exit();
                return;
            } else if (err || res.body.message === 'ERRORRRSSSS') {

                console.log(err, registryServer);
                console.log(chalk.red('\nThere has been an error publishing your resume.'));
                // console.log('Details:', error, res.body.message);
                console.log(chalk.blue('Please check you are using correct login details.'));
            } else {

                // console.log(res.body);
                console.log(chalk.green('\nSuccess! Your resume is now published at:'), res.body.url);


                if (process && process.platform !== 'win32') {

                    read({
                        prompt: 'Would you like to open your newly published resume in the web browser? [y/n]: '
                    }, function(er, answer) {
                        if (answer === 'y') {
                            open(res.body.url);
                            process.exit();
                        } else if (answer === 'n') {
                            process.exit();
                        }
                    });
                }
            }
        });
    return;
}
