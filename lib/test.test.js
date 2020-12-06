const assert = require('assert');
const validate = require('../lib/test');

describe('validate', () => {
  it('should not throw an error for a valid resume object', (done) => {
    validate({ basics: {} }).then(() => done());
  });
  it('should throw an error for an invalid resume object', (done) => {
    validate({ notInTheSchema: true }).catch(({ message }) => {
      assert.equal(
        message,
        `An error occurred 'Additional properties not allowed: notInTheSchema'.`,
      );
      done();
    });
  });
});
