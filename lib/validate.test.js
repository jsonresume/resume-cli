import validate from './validate';

describe('validate', () => {
  it('should not throw an error for a valid resume object', async () => {
    await validate({ basics: {} });
  });
  it('should throw an error for an invalid resume object', async () => {
    await expect(
      validate({ notInTheSchema: true }),
    ).rejects.toMatchInlineSnapshot(
      `[Error: An error occurred 'Additional properties not allowed: notInTheSchema'.]`,
    );
  });
});
