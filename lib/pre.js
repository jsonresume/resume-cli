const fs = require('fs');
const homeDirectory = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const jsonlint = require('jsonlint');
const chalk = require('chalk');

module.exports = {
  getConfig(callback) {
    fs.readFile(homeDirectory + '/.jsonresume.json', (err, data) => {
      let config;

      if (err) {
        config = false;
      } else {
        try {
          config = JSON.parse(data);
        } catch (err) {
          // if exists but is empty
          config = false;
        }
      }

      callback(null, config);
    });
  },
  getResume(callback) {
    fs.readFile('./resume.json', (resumeJsonDoesNotExist, data) => {

      if (resumeJsonDoesNotExist) {
        if (['export', 'publish', 'test'].indexOf(process.argv[2]) !== -1) { // removed serve. test this later
          console.log('There is no resume.json file located in this directory');
          console.log('Type: `resume init` to initialize a new resume');
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
  },
  checkPkgVersion: ['getConfig', checkPkgVersion]
};


const checkPkgVersion = (callback, results) => {

  const config = results.getConfig || {};
  const currentTime = (new Date).getTime();

  const itIsHighTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day

  if (itIsHighTime || !config.checkVersion) { // if it's time to check or if a check has not been run berofe

    config.checkVersion = currentTime;

    isUpToDate((_err) => {

      writeToConfig(config, callback);

    });

  } else {
    callback(null)
  }

}

const homeDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

const writeToConfig = (authObj, callback) => {
  fs.writeFile(homeDir + '/.jsonresume.json', JSON.stringify(authObj, undefined, 2), callback);
}

const isUpToDate = (callback) => {
  const request = require('superagent');
  const pkg = require('../package.json');

  console.log('Checking NPM for latest version...');

  request.get('https://registry.npmjs.org/resume-cli', (res) => {
    if (res.error) {
      return callback(res.error);
    }

    const latestnpmVersion = res.body['dist-tags'].latest;
    const localVersion = pkg.version;

    if (localVersion === latestnpmVersion) {
      console.log('Your resume-cli software is up-to-date.');
    } else {
      console.log(chalk.yellow('Notice: You are currently using an out-of-date version of resume-cli.'));
      console.log(chalk.cyan('Run'), '`npm update -g resume-cli`', chalk.cyan('to update to version'), latestnpmVersion);
    }

    callback(null);
  });
}
