var fs = require('fs');
var homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var resumeSchema = require('resume-schema');

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
        fs.readFile('./resume.json', function(error, data) {
            if (error) {
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
    }
];