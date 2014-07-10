var request = require('superagent');
var pjson = require('../package.json');
var fs = require('fs');

// get home directory 
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function writeToConfig(authObj) {
    fs.writeFileSync(homeDir + '/.jsonresume.json', JSON.stringify(authObj, undefined, 2));
}

function checkNPMVersion(callback) {
    request.get('http://registry.npmjs.org/resume-cli', function(res) {
        LatestnpmVersion = res.body['dist-tags'].latest;
        localVersion = pjson.version;

        if (localVersion !== LatestnpmVersion) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

function getNewSessionAuth() {

}

function checkConfigFile(callback) {

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

                checkNPMVersion(function(outOfDate) {
                    if (outOfDate) {

                        callback('out of date');
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