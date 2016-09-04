var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';

var fs = require('fs');
var request = require('superagent');
var chalk = require('chalk');
var path = require('path');

function sendExportHTML(resumeJson, theme, callback) {

  console.log(resumeJson, theme);
  console.log('Requesting theme from server...');


  request
    .post(themeServer + theme)
    .send({
        resume: resumeJson
    })
    .set('Accept', 'application/json')
    .end(function(err, response) {
      if (err) {
        callback('There was an error downloading your generated html resume from our server: ' + err);
      } else if (response.text) {
        callback(null, response.text);
      } else {
        callback('There was an error downloading your generated html resume from our server.');
      }
    });
}

module.exports = function resumeBuilder(theme, dir, resumeFilename, cb) {

  fs.readFile(resumeFilename, function(err, resumeJson) {
    if (err) {
      console.log(chalk.yellow('Could not find:'), resumeFilename);
      console.log(chalk.cyan('Using example resume.json from resume-schema instead...'));
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

    var packageJson = {};

    try {
      packageJson = require(path.join(process.cwd(), 'package'));
    } catch(e) {
      // 'package' module does not exist
    }

    var render;
    try {
      render = require(path.join(process.cwd(), packageJson.main || 'index')).render;
    } catch(e) {
      // The file does not exist.
    }

    if(render && typeof render === 'function') {
      try {
        var rendered = render(resumeJson);
        return typeof rendered.then === 'function' // check if it's a promise
          ? rendered.then(cb.bind(null, null), cb)
          : cb(null, rendered);
      } catch (e) {
        return cb(e);
      }
    } else {
      console.log(chalk.yellow('Could not run the render function from local theme.'));
      sendExportHTML(resumeJson, theme, cb);
    }

  });
};
