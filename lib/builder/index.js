const themeServer =
  process.env.THEME_SERVER || 'https://themes.jsonresume.org/theme/';
const path = require('path');
const fs = require('fs');
const request = require('superagent');
const chalk = require('chalk');

const sendExportHTML = (resumeJson, theme, callback) => {
  console.log(resumeJson, theme);
  console.log('Requesting theme from server...');

  request
    .post(themeServer + theme)
    .send({
      resume: resumeJson,
    })
    .set('Accept', 'application/json')
    .end((err, response) => {
      if (err) {
        callback(
          'There was an error downloading your generated html resume from our server: ' +
            err,
        );
      } else if (response.text) {
        callback(null, response.text);
      } else {
        callback(
          'There was an error downloading your generated html resume from our server.',
        );
      }
    });
};

module.exports = (theme, _dir, resumeFilename, cb) => {
  fs.readFile(resumeFilename, (err, resumeJson) => {
    if (err) {
      console.log(chalk.yellow('Could not find:'), resumeFilename);
      console.log(
        chalk.cyan('Using example resume.json from resume-schema instead...'),
      );
      resumeJson = require('resume-schema').resumeJson;
    } else {
      try {
        // todo: test resume schema
        resumeJson = JSON.parse(resumeJson);
      } catch (e) {
        err = 'Parse error: ' + resumeFilename;
        return cb(err);
      }
    }

    let render;
    try {
      if (theme[0] === '.') {
        theme = path.join(process.cwd(), theme, 'index.js');
      }
      render = require(theme).render;
    } catch (e) {
      // The file does not exist.
      console.log('The specified local theme failed with the error below');
      console.log(chalk.red(e));
    }

    if (render && typeof render === 'function') {
      try {
        const rendered = render(resumeJson);
        return typeof rendered.then === 'function' // check if it's a promise
          ? rendered.then(cb.bind(null, null), cb)
          : cb(null, rendered);
      } catch (e) {
        return cb(e);
      }
    } else {
      console.log(
        chalk.yellow('Could not run the render function from local theme.'),
      );
      sendExportHTML(resumeJson, theme, cb);
    }
  });
};
