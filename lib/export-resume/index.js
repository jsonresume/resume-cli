var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var request = require('superagent');
var http = require('http');
var fs = require('fs');
var path = require('path');
var read = require('read');
var spinner = require("char-spinner");
var menu = require('./menu');
var chalk = require('chalk');

var SUPPORTED_FILE_FORMATS = ["html", "pdf"];

module.exports = function exportResume(resumeJson, fileName, program, callback) {
  var theme = program.theme;

  if (!fileName) {
    read({
      prompt: "Provide a file name: ",
      default: 'resume'
    }, function(er, fileName) {
      if (er) return console.log();
      var fileName = fileName;
      fileNameAndFormat = getFileNameAndFormat(fileName, program.format);
      var fileFormatToUse = fileNameAndFormat.fileFormatToUse;
      fileName = fileNameAndFormat.fileName;

      menu.extension(fileFormatToUse, function(format) {
        if (format === '.html') {
          sendExportRequest(resumeJson, fileName, theme, format, function() {
            callback(null, fileName, format);
          });
        } else if (format === '.pdf') {
          sendExportPDFRequest(resumeJson, fileName, theme, format, function() {
            callback(null, fileName, format);
          });
        }
      });
    });
  } else {
    var fileNameAndFormat = getFileNameAndFormat(fileName, program.format);
    fileName = fileNameAndFormat.fileName;
    var fileFormatToUse = fileNameAndFormat.fileFormatToUse;

    menu.extension(fileFormatToUse, function(format) {
      if (format === '.html') {
        sendExportRequest(resumeJson, fileName, theme, format, function() {
          callback(null, fileName, format);
        });
      } else if (format === '.pdf') {
        sendExportPDFRequest(resumeJson, fileName, theme, format, function() {
          callback(null, fileName, format);
        });
      }
    });
  }
}

function extractFileFormat(fileName) {
  var dotPos = fileName.lastIndexOf('.');
  if (dotPos === -1) {
    return null;
  }
  return fileName.substring(dotPos + 1).toLowerCase();
}

function sendExportRequest(resumeJson, fileName, theme, format, callback) {
  spinner();
  request
    .post(themeServer + theme)
    .send({
      resume: resumeJson
    })
    .set('Accept', 'application/json')
    .end(function(err, response) {
      if (!response) {
        console.log(chalk.red('Unable to extablish connection to the theme server.'));
        console.log('Check your network connection');
        process.exit();
      }
      if (response.body.code === 'theme_not_found') {
        console.log(chalk.red('Unable to find that theme on npm, export aborted'));
        console.log('To see a dump of all available themes goto', 'http://themes.jsonresume.org/themes.json');
        process.exit();

      }
      fs.writeFileSync(path.resolve(process.cwd(), fileName + format), response.text);
      callback();
    });
  return;
}

function sendExportPDFRequest(resumeJson, fileName, theme, format, callback) {
  spinner();
  var stream = fs.createWriteStream(path.resolve(process.cwd(), fileName + format));
  var req = request
    .get(registryServer + '/pdf')
    .send({
      resume: resumeJson,
      theme: theme
    })
    .set('Accept', 'application/json');

  req.pipe(stream);
  stream.on('finish', function() {
    stream.close(callback);
  });
  return;
}

function getFileNameAndFormat(fileName, format) {
  var fileFormatFound = extractFileFormat(fileName);
  var fileFormatToUse = format;
  if (format && fileFormatFound && format === fileFormatFound) {
    fileName = fileName.substring(0, fileName.lastIndexOf('.'));
  } else if (fileFormatFound) {
    fileFormatToUse = fileFormatFound;
    fileName = fileName.substring(0, fileName.lastIndexOf('.'));
  }
  if (SUPPORTED_FILE_FORMATS.indexOf(fileFormatToUse) === -1) {
    fileFormatToUse = null;
  }
  return {
    fileName: fileName,
    fileFormatToUse: fileFormatToUse
  };
}
