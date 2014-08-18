var fs = require('fs');
var homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var resumeSchema = require('resume-schema');
var jsonlint = require('jsonlint');
var checkVersionAndSession = require('./version').checkVersionAndSession;
var test = require('./test');

Array.prototype.intersect = function() {
    if(!arguments.length) { return []; }
    var a1 = this;
    var a = a2 = null;
    var n = 0;
    while(n < arguments.length){
        a = [];
        a2 = arguments[n];
        var l = a1.length;
        var l2 = a2.length;
        for(var i=0;i<l;++i){
            for(var j=0;j<l2;++j){
                if(a1[i] === a2[j]){
                    a.push(a1[i]);
                }
            }
        }
        a1 = a;
        n++;
    }
    return a.unique();
}
Array.prototype.unique = function(){
    var u = {}, a = [];
    for(var i=0,l=this.length;i<l;++i){
        if(u.hasOwnProperty(this[i])){ continue; }
        a.push(this[i]);
        u[this[i]] = ;
    }
    return a;
}

module.exports = [
    // get config file
    function(callback) {
        var results = {};
        var jsonConfigFile = homeDirectory + '/.jsonresume.json';
        jsonConfigFileParamIndex = process.argv.indexOf('-c');
        if(process.argv.length > jsonConfigFileParamIndex && jsonConfigFileParamIndex != -1){
            jsonConfigFile = process.argv[jsonConfigFileParamIndex + 1];
        }
        fs.readFile(jsonConfigFile, function(noConfigFile, config) {
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
        var resumeFileName = './resume.json';
        var resumeFlagParamIndex = process.argv.indexOf('-r');
        if(process.argv.length > resumeFlagParamIndex && resumeFlagParamIndex != -1){
            resumeFileName = process.argv[resumeFlagParamIndex + 1];
        }
        fs.readFile(resumeFileName, function(resumeJsonDoesNotExist, data) {
            if (resumeJsonDoesNotExist) {
                if (['export', 'publish', 'test'].intersect(process.argv).lenth > 0) { // removed serve. test this later
                    console.log('There is no ' + resumeFileName + ' file located in this directory');
                    console.log('Type: `resume init` to initialize a new resume');
                    return;
                }
                var resumeJson = false;
                callback(null, results);
            } else {
                try {
                    jsonlint.parse(String(data));
                    var resumeJson = JSON.parse(data);
                    results.resumeJson = resumeJson;
                    callback(null, results);
                } catch (error) {
                    console.log(error);
                }
            }
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
        checkVersionAndSession(results.config, null, function(outOfDate, LatestnpmVersion) {
            if (outOfDate === true) {
                console.log('Notice: You are currently using an out-of-date version of resume-cli.'.yellow);
                console.log('Type'.cyan, '`sudo npm update -g resume-cli`', 'to upgrade to version'.cyan, LatestnpmVersion);
            } else if (outOfDate === false) {
                console.log('Your resume-cli software is up-to-date.');
            }
            callback(null, results);
        });
    },
    function(results, callback) {
        if (['export', 'publish'].intersect(process.argv).length > 0) { // remove serve for the time being
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
