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
        npmVersion = res.body['dist-tags'].latest;
        localVersion = pjson.version;
        console.log(npmVersion);
        console.log(localVersion);
        if (localVersion !== npmVersion) {
            // callback(true);
            console.log('Notice: You are currently using an old version of resume-cli');
            console.log('Type `sudo npm install -g resume-cli` to get version', npmVersion);
        }
    });

}

function getNewSessionAuth() {

}

var currentTime = (new Date).getTime();

fs.readFile(homeDir + '/.jsonresume.json', 'utf8', function(fileDoesNotExist, config) {

    if (fileDoesNotExist) {
        console.log('file does not already exist.');

        writeToConfig({
            checkVersion: currentTime,
            checkSession: currentTime
        });

    } else {
        config = JSON.parse(config);
        console.log('config file already exists');
        var itIsCheckVersionTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day
        var itIsCheckSessionTime = currentTime - config.checkSession > 604800000; // refresh session every 7 days 

        console.log(itIsCheckVersionTime, itIsCheckSessionTime, config.checkVersion, config);


        if (itIsCheckVersionTime || typeof(config.checkVersion) === 'undefined') {

            config.checkVersion = currentTime;
            console.log(config);
            writeToConfig(config);

            checkNPMVersion();

        }
        if (itIsCheckSessionTime || typeof(config.checkSession) === 'undefined') {
            getNewSessionAuth()

            config.checkSession = currentTime;
            writeToConfig(config);
        }
    }

});