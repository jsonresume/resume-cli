var fs = require('fs');
var homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

module.exports = function writeConfig(authObj, callback) {
    fs.readFile(homeDir + '/.jsonresume.json', 'utf8', function(fileDoesNotExist, config) {
        // console.log(authObj);
        config = JSON.parse(config);
        config = {
            username: authObj.username,
            email: authObj.email,
            session: authObj.session,
            checkVersion: config && config.checkVersion,
            checkSession: config && config.checkSession
        };
        // console.log(config);
        fs.writeFileSync(homeDir + '/.jsonresume.json', JSON.stringify(config, undefined, 2));
        //todo: use async
        callback(true);
    });
};
