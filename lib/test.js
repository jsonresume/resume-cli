const schema = require('resume-schema/schema.json');
const promisify = require('util.promisify');
const ZSchema = require('z-schema');
const ZSchemaErrors = require('z-schema-errors');

const path = require('path');
const fs = require('fs');
const getSchema = function () {
  const index = process.argv.findIndex((value) => value === '--schema');
  if (index === -1) {
    return schema;
  } // Return the default schema, if a custom schema wasn't specified

  try {
    const customSchemaPath = path.join(process.cwd(), process.argv[index + 1]);
    return JSON.parse(fs.readFileSync(customSchemaPath, { encoding: 'utf-8' }));
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

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
