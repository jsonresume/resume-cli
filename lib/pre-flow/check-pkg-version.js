var fs = require('fs');
var request = require('superagent');
var pkg = require('../../package.json');

module.exports = function checkPkgVersion(callback, results) {

  var config = results.getConfig || {};
  var currentTime = (new Date).getTime();

  var itIsHighTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day

  if (itIsHighTime || !config.checkVersion) { // if it's time to check or if a check has not been run berofe

    config.checkVersion = currentTime;

    isUpToDate(function(err) {

      writeToConfig(config, callback);

    });

  } else {
    callback(null)
  }

};

var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function writeToConfig(authObj, callback) {
  fs.writeFile(homeDir + '/.jsonresume.json', JSON.stringify(authObj, undefined, 2), callback);
}

function isUpToDate(callback) {

  console.log('Checking NPM for latest version...');

  request.get('http://registry.npmjs.org/resume-cli', function(res) {
    if (res.error) {
      return callback(res.error);
    }

    latestnpmVersion = res.body['dist-tags'].latest;
    localVersion = pkg.version;

    if (localVersion === latestnpmVersion) {
      console.log('Your resume-cli software is up-to-date.');
    } else {
      console.log('Notice: You are currently using an out-of-date version of resume-cli.'.yellow);
      console.log('Type'.cyan, '`sudo npm update -g resume-cli`', 'to upgrade to version'.cyan, latestnpmVersion);
    }

    callback(null);
  });
}
