var fs = require('fs');
var jsonlint = require('jsonlint');

module.exports = function getResume(callback) {
  var jsonLocation = './resume.json';
  process.argv.forEach(function(arg) {
    if(arg.indexOf('--resume') !== -1 || arg.indexOf('-r') !== -1) {
      jsonLocation = arg.replace('--resume=', '').replace('-r=','');
    }
  });
  fs.readFile(jsonLocation, function(resumeJsonDoesNotExist, data) {

    if (resumeJsonDoesNotExist) {
      if (['export', 'test'].indexOf(process.argv[2]) !== -1) { // removed serve. test this later
        console.log('There is no resume.json file located in this directory');
        console.log('Type: `resume init` to initialize a new resume');
        return;
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
}
