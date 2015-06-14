var fs = require('fs');
var homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var resumeSchema = require('resume-schema');
var jsonlint = require('jsonlint');
var checkVersionAndSession = require('./version').checkVersionAndSession;
var writeNewConfig = require('./version').writeNewConfig;
var test = require('./test');

module.exports = {
  getConfig: function(callback) {
    var results = {};
    fs.readFile(homeDirectory + '/.jsonresume.json', function(noConfigFile, config) {
      if (noConfigFile) {
        var config = false;
      } else {

        try {
          var config = JSON.parse(config);
        } catch (err) {
          // if exists but is empty
          var config = false;
        }
      }

      callback(null, config);
    });
  },
  getResume: function(callback) {
    fs.readFile('./resume.json', function(resumeJsonDoesNotExist, data) {

      if (resumeJsonDoesNotExist) {
        if (['export', 'publish', 'test'].indexOf(process.argv[2]) !== -1) { // removed serve. test this later
          console.log('There is no resume.json file located in this directory');
          console.log('Type: `resume init` to initialize a new resume');
        }

        var resumeJson = false;
        callback(null);
      } else {
        try {
          jsonlint.parse(String(data));
          var resumeJson = JSON.parse(data);

          callback(null, resumeJson);
        } catch (error) {
          callback(error);
        }
      }
    });
  },
  checkPkgVersion: ['getConfig', checkPkgVersion]
};


function checkPkgVersion(callback, results) {

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
  var request = require('superagent');
  var pkg = require('../package.json');

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
