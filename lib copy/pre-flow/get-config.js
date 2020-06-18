var fs = require('fs');
var homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];


module.exports = function getConfig(callback) {
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
}
