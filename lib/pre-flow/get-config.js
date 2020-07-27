const fs = require('fs');
const homeDirectory =
  process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];

module.exports = (callback) => {
  fs.readFile(homeDirectory + '/.jsonresume.json', (err, data) => {
    let config;

    if (err) {
      config = false;
    } else {
      try {
        config = JSON.parse(data);
      } catch (err) {
        config = false;
      }
    }

    callback(null, config);
  });
};
