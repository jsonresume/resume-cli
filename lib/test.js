const schema = require('resume-schema/schema.json');
const promisify = require('util.promisify');
const ZSchema = require('z-schema');
const ZSchemaErrors = require('z-schema-errors');

const path = require('path');
const fs = require('fs');
const getSchema = function() {
  var index = process.argv.findIndex(value => value === '--schema');         
  if (index === -1) { return schema; }  // Return the default schema, if a custom schema wasn't specified
  
  var path_arg = process.argv[index + 1];
  var pathToFile = path.join(process.cwd(), path_arg);
  var customSchema = fs.readFileSync(pathToFile, { encoding: 'utf8' });
  var customSchemaJSON = JSON.parse(customSchema);
  return customSchemaJSON;
}

const reporter = ZSchemaErrors.init();
const validator = new ZSchema();
const validate = promisify((obj, ...args) =>
  validator.validate(obj, getSchema(), ...args),
);
module.exports = async (resume) => {
  try {
    return await validate(resume);
  } catch (errors) {
    throw new Error(reporter.extractMessage({ report: { errors } }));
  }
};
