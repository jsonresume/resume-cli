import validate from './validate';
import getSchema from './get-schema';

describe('validate', () => {
  let defaultSchema;
  beforeEach(async () => {
    defaultSchema = await getSchema();
  });
  it('should not throw an error for a valid resume object', async () => {
    await validate({ resume: { basics: {} }, schema: defaultSchema });
  });
  it('should throw an error for an invalid resume object', async () => {
    await expect(
      validate({ resume: { notInTheSchema: true }, schema: defaultSchema }),
    ).rejects.toMatchInlineSnapshot(
      `[Error: An error occurred 'Additional properties not allowed: notInTheSchema'.]`,
    );
  });
  it('should accept a schema override', async () => {
    await validate({
      resume: 123,
      schema: { type: 'number' },
    });
    await expect(
      validate({
        resume: 'thomas',
        schema: { type: 'number' },
      }),
    ).rejects.toMatchInlineSnapshot(
      `[Error: An error occurred 'Expected type number but found type string'.]`,
    );
  });
});
