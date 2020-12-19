module.exports = {
  maxWorkers: 1, // maintains isTTY, since using a single worker will not cause jest to use child processes to run the tests
  setupFilesAfterEnv: ['jest-extended'],
  roots: ['<rootDir>/lib'],
};
