var getConfig = require('./get-config');
var getResume = require('./get-resume');
var validateSchema = require('./validate-schema');
var checkPkgVersion = require('./check-pkg-version');

// This is the first argument for the async.auto function that runs before all commands.
module.exports = {
  getConfig: getConfig,
  getResume: getResume,
  // The first item in these arrays are condition dependencies
  validateSchema: ['getResume', validateSchema],
  checkPkgVersion: ['getConfig', checkPkgVersion]
};
