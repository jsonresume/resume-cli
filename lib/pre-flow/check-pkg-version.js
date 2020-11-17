const fs = require('fs');
const request = require('superagent');
const pkg = require('../../package.json');
const chalk = require('chalk');

module.exports = (results, callback) => {
  const config = results.getConfig || {};
  const currentTime = new Date().getTime();

  const itIsHighTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day

  if (itIsHighTime || !config.checkVersion) {
    // if it's time to check or if a check has not been run berofe

    config.checkVersion = currentTime;

    isUpToDate((_err) => {
      writeToConfig(config, callback);
    });
  } else {
    callback(null);
  }
};

const homeDir =
  process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];

const writeToConfig = (authObj, callback) => {
  fs.writeFile(
    homeDir + '/.jsonresume.json',
    JSON.stringify(authObj, undefined, 2),
    callback,
  );
};

const isUpToDate = (callback) => {
  console.log('Checking NPM for latest version...');

  request.get('https://registry.npmjs.org/resume-cli', (err, res) => {
    if (err) {
      return callback(err);
    }

    const latestnpmVersion = res.body['dist-tags'].latest;
    const localVersion = pkg.version;

    if (localVersion === latestnpmVersion) {
      console.log('Your resume-cli software is up-to-date.');
    } else {
      console.log(
        chalk.yellow(
          'Notice: You are currently using an out-of-date version of resume-cli.',
        ),
      );
      console.log(
        chalk.cyan('Run'),
        '`npm update -g resume-cli`',
        chalk.cyan('to update to version'),
        latestnpmVersion,
      );
    }

    callback(null);
  });
};
