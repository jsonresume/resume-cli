var request = require('superagent');
var pjson = require('../package.json');

// homedir = '.jsonresume';

module.exports = function(callback) {
    request.get('http://registry.npmjs.org/resume-cli', function(res) {
        npmVersion = res.body['dist-tags'].latest;
        localVersion = pjson.version;
        console.log(npmVersion);
        console.log(localVersion);
        if (localVersion === npmVersion) {
            callback(true);
            console.log('Notice: You are currently using an old version of resume-cli');
            console.log('Type `sudo npm install -g resume-cli` to get version', npmVersion);
        }

    });
}