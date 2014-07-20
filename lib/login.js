var read = require('read');
var fs = require('fs');
var request = require('superagent');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('attempting to login...');
spinner.setSpinnerString('/-\\');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function login(resumeJson) {
    read({
        prompt: "email: "
    }, function(er, email) {
        if (er) {
            console.log();
            process.exit();
        }
        read({
            prompt: "password: ",
            silent: true
        }, function(er, pass) {
            if (er) {
                console.log();
                process.exit();
            }
            logMeIn({
                email: email,
                password: pass,
            });
        });
    });
}

function logMeIn(userInfo) {
    spinner.start();
    request
        .post(registryServer + '/session')
        .send(userInfo)
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, response) {
            spinner.stop();
            console.log();
            // console.log(response.body); //if success. 
            if (error) {
                console.log(error);
                console.log('There has been an error trying to log you in.'.red);
            } else if (response.body.message === 'loggedIn') {

                console.log('Success! You are now logged in.'.green);
                // console.log(response.body);
                // console.log(response.body.message);

                writeConfig({
                    username: response.body.username,
                    email: response.body.email,
                    session: response.body.session
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

module.exports = login;

var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function writeConfig(authObj, callback) {
    fs.readFile(homeDir + '/.jsonresume.json', 'utf8', function(fileDoesNotExist, config) {
        // console.log(authObj);
        config = JSON.parse(config);
        config = {
            username: authObj.username,
            email: authObj.email,
            session: authObj.session,
            checkVersion: config && config.checkVersion,
            checkSession: config && config.checkSession
        };
        // console.log(config);
        fs.writeFileSync(homeDir + '/.jsonresume.json', JSON.stringify(config, undefined, 2));
        //todo: use async
        callback(true);
    });
}