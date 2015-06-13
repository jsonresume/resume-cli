var fs = require('fs');
var homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var resumeSchema = require('resume-schema');
var jsonlint = require('jsonlint');
var test = require('../test');
var checkPkgVersion = require('./check-pkg-version');

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
          var config = false;
        }
      }
      // results.config = config;
      // console.log(config);
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
  validateSchema: ['getResume', function(callback, results) {
    resumeSchema.validate(results.getResume, function(report, errors) {
      if (errors) {
        results.valid = false;
      } else {
        results.valid = true;
      }
      callback(null, results);
      // check validation
    });
  }],
  // sometimes not returning
  test: ['getResume', function(callback, results) {
    var options = process.argv.slice(2);
    if (['export', 'publish'].indexOf(process.argv[2]) !== -1) { // remove serve for the time being
      if (options.indexOf('-F') === -1 && options.indexOf('--force') === -1) {
        test.validate(results.getResume, function(error, response) {
          if (error) {
            return console.log(response.message);
          }
          callback(null, results);
        });
      } else {
        callback(null, results);
      }
    } else {
      callback(null, results);
    }
  }],
  checkPkgVersion: ['getConfig', checkPkgVersion]
};
