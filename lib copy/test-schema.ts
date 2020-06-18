import schema from 'resume-schema/schema.json';
import promisify from 'util.promisify';
import ZSchema from 'z-schema';
import ZSchemaErrors from 'z-schema-errors';

const reporter = ZSchemaErrors.init();
const validator = new ZSchema({});

const validate = promisify((obj) => validator.validate(obj, schema));

export default async (resume: Object) => {
  try {
    return await validate(resume);
  } catch (errors) {
    throw new Error(reporter.extractMessage({ report: { errors } }));
  }
};
