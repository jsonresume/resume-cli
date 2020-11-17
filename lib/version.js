const request = require('superagent');
const pkg = require('../package.json');
const fs = require('fs');

// get home directory
const homeDir =
  process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];

const writeToConfig = (authObj, callback) => {
  fs.writeFile(
    homeDir + '/.jsonresume.json',
    JSON.stringify(authObj, undefined, 2),
    callback,
  );
};

const checkNPMVersion = (callback) => {
  console.log('Checking for latest version on NPM..');

  request.get('https://registry.npmjs.org/resume-cli', (res) => {
    const latestnpmVersion = res.body['dist-tags'].latest;
    const localVersion = pkg.version;

    callback(localVersion !== latestnpmVersion, latestnpmVersion);
  });
};

//todo: set session time
const checkVersionAndSession = (config, _setSessionTime, callback) => {
  const currentTime = new Date().getTime();

  if (!config) {
    writeToConfig(
      {
        checkVersion: currentTime,
        checkSession: currentTime,
      },
      (err) => {
        return callback(err);
      },
    );
  }

  // console.log(config.checkVersion);

  //config file exists
  // config = JSON.parse(config);
  const itIsCheckVersionTime = currentTime - config.checkVersion > 86400000; // check if module is up-to-date every day
  const itIsCheckSessionTime = currentTime - config.checkSession > 604800000; // refresh session every 7 days

  // console.log(itIsCheckVersionTime, itIsCheckSessionTime, config.checkVersion, config);
  if (itIsCheckVersionTime || typeof config.checkVersion === 'undefined') {
    config.checkVersion = currentTime;
    writeToConfig(config, (_err) => {
      checkNPMVersion((outOfDate, LatestnpmVersion) => {
        callback(outOfDate, LatestnpmVersion);
      });
    });
  } else if (
    itIsCheckSessionTime ||
    typeof config.checkSession === 'undefined'
  ) {
    // getNewSessionAuth()
    config.checkSession = currentTime;
    writeToConfig(config, (_err) => {
      callback();
    });
  }
  callback();
};

module.exports = {
  checkVersionAndSession: checkVersionAndSession,
};
