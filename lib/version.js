var request = require('superagent');
var pjson = require('../package.json');
var fs = require('fs');

//move this to version.js?
// if (message === 'out of date') {
//     console.log('Notice: You are currently using out-of-date version'.yellow, pkg.version, 'resume-cli.'.yellow);
//     console.log('Type'.cyan, '`sudo npm install -g resume-cli`', 'to upgrade to version'.cyan, LatestnpmVersion);
// } else {
//     console.log('Your resume-cli software is up-to-date.');
// }

// get home directory 
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function writeToConfig(authObj) {
    fs.writeFileSync(homeDir + '/.jsonresume.json', JSON.stringify(authObj, undefined, 2));
}

function checkNPMVersion(callback) {

    console.log('Checking latest version on NPM..');

    request.get('http://registry.npmjs.org/resume-cli', function(res) {
        LatestnpmVersion = res.body['dist-tags'].latest;
        localVersion = pjson.version;
        // console.log(localVersion, LatestnpmVersion);
        callback(localVersion !== LatestnpmVersion, LatestnpmVersion);
    });
}

function getNewSessionAuth() {

}

function checkConfigFile(auth, callback) {

    var currentTime = (new Date).getTime();

    fs.readFile(homeDir + '/.jsonresume.json', 'utf8', function(fileDoesNotExist, config) {

        if (fileDoesNotExist) {

            writeToConfig({
                checkVersion: currentTime,
                checkSession: currentTime
            });
            callback();

        } else {
            //config file exists
            config = JSON.parse(config);
            var itIsCheckVersionTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day
            var itIsCheckSessionTime = currentTime - config.checkSession > 604800000; // refresh session every 7 days 

            // console.log(itIsCheckVersionTime, itIsCheckSessionTime, config.checkVersion, config);


            if (itIsCheckVersionTime || typeof(config.checkVersion) === 'undefined') {

                config.checkVersion = currentTime;

                writeToConfig(config);

                checkNPMVersion(function(outOfDate, LatestnpmVersion) {
                    if (outOfDate) {

                        callback('out of date', LatestnpmVersion);
                    } else {
                        callback();
                    }
                });

            } else if (itIsCheckSessionTime || typeof(config.checkSession) === 'undefined') {
                getNewSessionAuth()

                config.checkSession = currentTime;
                writeToConfig(config);
                callback();
            } else {
                callback();
            }


        }

    });

}

module.exports = {
    checkConfigFile: checkConfigFile
};