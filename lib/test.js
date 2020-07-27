const schema = require('resume-schema/schema.json');
const promisify = require('util.promisify');
const ZSchema = require('z-schema');
const ZSchemaErrors = require('z-schema-errors');

const reporter = ZSchemaErrors.init();
const validator = new ZSchema();
const validate = promisify((obj, ...args) =>
  validator.validate(obj, schema, ...args),
);
module.exports = async (resume) => {
  try {
    return await validate(resume);
  } catch (errors) {
    throw new Error(reporter.extractMessage({ report: { errors } }));
  }
};
