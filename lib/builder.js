var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';

var fs = require('fs');
var request = require('superagent');
var chalk = require('chalk');

function sendExportHTML(resumeJson, theme, callback) {
  console.log('Requesting theme from server...');
  request
    .post(themeServer + theme)
    .send({
        resume: resumeJson
    })
    .set('Accept', 'application/json')
    .end(function(response) {
        if (response.text) {
            callback(null, response.text);
        } else {
          callback('There was an error downloading your generated html resume from our server.');
        }
    });
  return;
}

module.exports = function resumeBuilder(theme, cb) {
  var file = process.cwd() + '/resume.json';
  fs.readFile(file, function(err, resumeJson) {
    var resumeJson;
    if (err) {
      console.log(chalk.yellow('Could not find:'), file);
      console.log(chalk.cyan('Using example resume.json from resume-schema instead...'));
      resumeJson = require('resume-schema').resumeJson;
    } else {
      try {
        // todo: test resume schema
        resumeJson = JSON.parse(resumeJson);
      } catch (e) {
        var err = 'Parse error: ' + file;
        return cb(err);
      }
    }

    var render;
    try {
      render = require(process.cwd() + '/index').render;
    } catch(e) {
      // The file does not exist.
    }

    if(render && typeof render === 'function') {
      return cb(null, render(resumeJson));
    } else {
      console.log(chalk.yellow('Could not run the render function from local theme.'));
      sendExportHTML(resumeJson, theme, cb);
    }

  });
};
