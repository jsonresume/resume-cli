var fs = require('fs');
var homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];


module.exports = function getConfig(callback) {
  fs.readFile(homeDirectory + '/.jsonresume.json', function(err, data) {
    let config;

    if (err) {
      config = false;
    } else {
      try {
        config = JSON.parse(data);
      } catch (err) {
        config = false;
      }
    }

    callback(null, config);
  });
}
