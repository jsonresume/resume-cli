var test = require('../test.js');

module.exports = function validateSchema(callback, results) {
  var options = process.argv.slice(2);
  if (['export', 'publish'].indexOf(process.argv[2]) !== -1) { // remove serve for the time being
    if (options.indexOf('-F') === -1 && options.indexOf('--force') === -1) {
      test.validate(results.getResume, function(error, response) {
        if (error) {
          console.log(response.message);
        }
        callback(error, results);
      });
    } else {
      callback(null, results);
    }
  } else {
    callback(null, results);
  }
};
