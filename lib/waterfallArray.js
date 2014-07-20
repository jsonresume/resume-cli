var fs = require('fs');
var homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var resumeSchema = require('resume-schema');
var checkVersionAndSession = require('./version').checkVersionAndSession;
var test = require('./test');

module.exports = [
    // get config file
    function(callback) {
        var results = {};
        fs.readFile(homeDirectory + '/.jsonresume.json', function(noConfigFile, config) {
            if (noConfigFile) {
                var config = false;
            } else {
                var config = JSON.parse(config);
            }
            results.config = config;
            callback(null, results);
        });
    },
    // get resume.json
    function(results, callback) {
        fs.readFile('./resume.json', function(resumeJsonDoesNotExist, data) {
            if (resumeJsonDoesNotExist) {
                if (['export', 'publish', 'serve', 'test'].indexOf(process.argv[2]) !== -1) {
                    console.log('There is no resume.json file located in this directory');
                    console.log('Type: `resume init` to initialize a new resume');
                    return;
                }

                var resumeJson = false;
            } else {
                try {
                    JSON.parse(data);
                    var resumeJson = JSON.parse(data);
                } catch (error) {
                    var resumeJson = error;
                }
            }
            results.resumeJson = resumeJson;
            callback(null, results);
        });
    },
    // is resume.json using valid schema?
    function(results, callback) {
        resumeSchema.validate(results.resumeJson, function(report, errors) {
            if (errors) {
                results.valid = false;
            } else {
                results.valid = true;
            }
            callback(null, results);
        });
    },

    function(results, callback) {
        checkVersionAndSession(results.config, null, function(outOfDate) {
            if (outOfDate === true) {
                console.log('Notice: You are currently using an out-of-date version of resume-cli.'.yellow);
                console.log('Type'.cyan, '`sudo npm install -g resume-cli`', 'to upgrade to version'.cyan, LatestnpmVersion);
            } else if (outOfDate === false) {
                console.log('Your resume-cli software is up-to-date.');
            }
            callback(null, results);
        });
    },
    function(results, callback) {
        if (['export', 'publish', 'serve'].indexOf(process.argv[2]) !== -1) {
            test.validate(results.resumeJson, function(error, response) {
                if (error) {
                    return console.log(response.message);
                }
                callback(null, results);
            });
        } else {
            callback(null, results);
        }
    }
];