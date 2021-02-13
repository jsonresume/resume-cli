const themeServer =
  process.env.THEME_SERVER || 'https://themes.jsonresume.org/theme/';
const fs = require('fs');
const request = require('superagent');
const chalk = require('chalk');
const renderHtml = require('./render-html').default;
const getResume = require('./get-resume.js').default;

const denormalizeTheme = (value) => {
  return value.match(/jsonresume-theme-(.*)/)[1];
};

const sendExportHTML = (resumeJson, theme, callback) => {
  console.log(resumeJson, theme);
  console.log('Requesting theme from server...');

  request
    .post(themeServer + denormalizeTheme(theme))
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
module.exports = async function resumeBuilder(theme, dir, resumeFilename, mime, cb) {
  let resume;
  try {
    resume = await getResume({
      path: resumeFilename,
      mime
    })
  } catch (e) {
    console.warn(e.message);
    console.log(
      chalk.cyan('Using example resume.json from resume-schema instead...'),
    );
    resume = require('resume-schema').resumeJson;
  }

  try {
    const html = await renderHtml({ resume: resume, themePath: theme });
    cb(null, html);
  } catch (err) {
    console.log(err);
    console.log(
      chalk.yellow('Could not run the render function from local theme.'),
    );
    sendExportHTML(resume, theme, cb);
  }
};
