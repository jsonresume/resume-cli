var request = require('superagent');
var pkg = require('../package.json');
var fs = require('fs');

// get home directory 
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function writeToConfig(authObj) {
    fs.writeFileSync(homeDir + '/.jsonresume.json', JSON.stringify(authObj, undefined, 2));
}

function checkNPMVersion(callback) {

    console.log('Checking for latest version on NPM..');

    request.get('http://registry.npmjs.org/resume-cli', function(res) {
        LatestnpmVersion = res.body['dist-tags'].latest;
        localVersion = pkg.version;
        // console.log(localVersion, LatestnpmVersion);
        callback(localVersion !== LatestnpmVersion, LatestnpmVersion);
    });
}

// function getNewSessionAuth() {
// }

//todo: set session time
function checkVersionAndSession(config, setSessionTime, callback) {

    // console.log(config.checkVersion);
    var currentTime = (new Date).getTime();

    if (config === false) {
        //make async
        writeToConfig({
            checkVersion: currentTime,
            checkSession: currentTime
        });

    } else {
        //config file exists
        // config = JSON.parse(config);
        var itIsCheckVersionTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day
        var itIsCheckSessionTime = currentTime - config.checkSession > 604800000; // refresh session every 7 days 

        // console.log(itIsCheckVersionTime, itIsCheckSessionTime, config.checkVersion, config);
        if (itIsCheckVersionTime || typeof(config.checkVersion) === 'undefined') {
            config.checkVersion = currentTime;
            writeToConfig(config);

            checkNPMVersion(function(outOfDate, LatestnpmVersion) {
                callback(outOfDate, LatestnpmVersion);
            });
        } else if (itIsCheckSessionTime || typeof(config.checkSession) === 'undefined') {
            // getNewSessionAuth()
            config.checkSession = currentTime;
            writeToConfig(config);
        }
    }
    callback();
}

module.exports = {
    checkVersionAndSession: checkVersionAndSession
};