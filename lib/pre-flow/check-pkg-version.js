var fs = require('fs');
var request = require('superagent');
var pkg = require('../../package.json');
var chalk = require('chalk');

module.exports = function checkPkgVersion(results, callback) {

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

  request.get('https://registry.npmjs.org/resume-cli', function(err, res) {
    if (err) {
      return callback(err);
    }

    latestnpmVersion = res.body['dist-tags'].latest;
    localVersion = pkg.version;

    if (localVersion === latestnpmVersion) {
      console.log('Your resume-cli software is up-to-date.');
    } else {
      console.log(chalk.yellow('Notice: You are currently using an out-of-date version of resume-cli.'));
      console.log(chalk.cyan('Run'), '`npm update -g resume-cli`', chalk.cyan('to update to version'), latestnpmVersion);
    }

    callback(null);
  });
}
