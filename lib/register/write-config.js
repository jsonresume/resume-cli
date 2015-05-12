var fs = require('fs');
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

module.exports = function writeConfig(authObj, callback) {

    var callback = callback || function(){};

    fs.readFile(homeDir + '/.jsonresume.json', 'utf8', function(fileDoesNotExist, config) {
        // console.log(authObj);
        config = JSON.parse(config);
        config = {
            username: authObj.username,
            email: authObj.email,
            session: config && config.session,
            checkVersion: config && config.checkVersion,
            checkSession: config && config.checkSession
        };
        // console.log(config);
        fs.writeFileSync(homeDir + '/.jsonresume.json', JSON.stringify(config, undefined, 2));
        //todo: use async

        console.log('Your user session has been saved in the jsonresume.json config file in your home directory.');
        callback(config);
    });
};
