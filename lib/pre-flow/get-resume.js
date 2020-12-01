const fs = require('fs');
const jsonlint = require('jsonlint');
const validate = require('../test');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
module.exports = async ({
  validate: doValidate = true,
  resumePath = './resume.json',
}) => {
  let resumeJSON;
  try {
    resumeJSON = await readFile(resumePath);
  } catch (err) {
    console.log(`There is no resume file located at ${resumePath}`);
    console.log('Type: `resume init` to initialize a new resume');
    throw err;
  }
  jsonlint.parse(String(resumeJSON));
  const resume = JSON.parse(resumeJSON);
  if (doValidate) {
    await validate(resume);
  }
  return resume;
};
