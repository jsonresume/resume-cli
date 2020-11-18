const getConfig = require('./get-config');
const getResume = require('./get-resume');
const validateSchema = require('./validate-schema');
const checkPkgVersion = require('./check-pkg-version');
const async = require('async');
// This is the first argument for the async.auto function that runs before all commands.
module.exports = (callback) => {
  async.auto(
    {
      getConfig: getConfig,
      getResume: getResume,
      // The first item in these arrays are condition dependencies for flow control
      validateSchema: ['getResume', validateSchema],
      checkPkgVersion: ['getConfig', checkPkgVersion],
      // TODO check authToken
    },
    callback,
  );
};
