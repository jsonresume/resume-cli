var test = require('../test.js');

module.exports = async function validateSchema(results, callback) {
  var options = process.argv.slice(2);
  if (['export', 'publish'].indexOf(process.argv[2]) === -1) { // remove serve for the time being
    return callback(null, results);
  }
  if (options.indexOf('-F') !== -1 || options.indexOf('--force') !== -1) {
    return callback(null, results);
  }
  try {
    const response = await test(results.getResume)
    callback(null, results);
  } catch (error) {
    console.log(error.message);
    callback(error)
  }
};
