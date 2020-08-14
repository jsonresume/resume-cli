const fs = require('fs');
const jsonlint = require('jsonlint');

module.exports = (callback) => {
  let jsonLocation = './resume.json';
  process.argv.forEach((arg) => {
    if (arg.indexOf('--resume') !== -1 || arg.indexOf('-r') !== -1) {
      var resume_arg_index = arg.indexOf("-r" !== -1 ? process.argv.findIndex(value => value === "-r") : process.argv.findIndex(value => value === "--resume"));
      jsonLocation = process.argv[resume_arg_index + 1];
    }
  });
  fs.readFile(jsonLocation, (resumeJsonDoesNotExist, data) => {
    if (resumeJsonDoesNotExist) {
      if (['export', 'test'].indexOf(process.argv[2]) !== -1) {
        // removed serve. test this later
        console.log('There is no resume.json file located in this directory');
        console.log('Type: `resume init` to initialize a new resume');
        return;
      }

      callback(null);
    } else {
      try {
        jsonlint.parse(String(data));
        const resumeJson = JSON.parse(data);

        callback(null, resumeJson);
      } catch (error) {
        callback(error);
      }
    }
  });
};
