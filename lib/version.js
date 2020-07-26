var request = require('superagent');
var pkg = require('../package.json');
var fs = require('fs');

// get home directory
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function writeToConfig(authObj, callback) {
  fs.writeFile(homeDir + '/.jsonresume.json', JSON.stringify(authObj, undefined, 2), callback);
}

function checkNPMVersion(callback) {

  console.log('Checking for latest version on NPM..');

  request.get('https://registry.npmjs.org/resume-cli', function(res) {
    const latestnpmVersion = res.body['dist-tags'].latest;
    const localVersion = pkg.version;

    callback(localVersion !== latestnpmVersion, latestnpmVersion);
  });
}


// function getNewSessionAuth() {
// }

//todo: set session time
function checkVersionAndSession(config, setSessionTime, callback) {

  var currentTime = (new Date).getTime();

  if(!config){
    writeToConfig({
      checkVersion: currentTime,
      checkSession: currentTime
    }, function(err) {

      return callback(err);
    });
  }

  // console.log(config.checkVersion);

  //config file exists
  // config = JSON.parse(config);
  var itIsCheckVersionTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day
  var itIsCheckSessionTime = currentTime - config.checkSession > 604800000; // refresh session every 7 days

  // console.log(itIsCheckVersionTime, itIsCheckSessionTime, config.checkVersion, config);
  if (itIsCheckVersionTime || typeof(config.checkVersion) === 'undefined') {

    config.checkVersion = currentTime;
    writeToConfig(config, function(_err) {


      checkNPMVersion(function(outOfDate, LatestnpmVersion) {

        callback(outOfDate, LatestnpmVersion);
      });

    });

  } else if (itIsCheckSessionTime || typeof(config.checkSession) === 'undefined') {
    // getNewSessionAuth()
    config.checkSession = currentTime;
    writeToConfig(config, function(_err) {

      callback();
    });
  }
  callback();

}

module.exports = {
  checkVersionAndSession: checkVersionAndSession
};
