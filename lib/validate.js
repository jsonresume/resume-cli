import { promisify } from 'util';
import ZSchema from 'z-schema';
import ZSchemaErrors from 'z-schema-errors';

const reporter = ZSchemaErrors.init();
const validator = new ZSchema();
const validate = promisify((...args) => validator.validate(...args)); // maintains context

export default async ({ resume, schema }) => {
  try {
    return await validate(resume, schema);
  } catch (errors) {
    throw new Error(reporter.extractMessage({ report: { errors } }));
  }
};
