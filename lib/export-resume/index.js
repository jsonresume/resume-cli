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
var pdf = require('html-pdf');

var SUPPORTED_FILE_FORMATS = ["html", "pdf"];

module.exports = function exportResume(resumeJson, fileName, program, callback) {
  var theme = program.theme;
  if(!theme.match('jsonresume-theme-.*')){
    theme = 'jsonresume-theme-' + theme;
  }

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
        createHtml(resumeJson, fileName, theme, format, function() {
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

function createHtml(resumeJson, fileName, theme, format, callback) {
  var html = renderHtml(resumeJson, theme);
  var stream = fs.createWriteStream(path.resolve(process.cwd(), fileName + format));

  stream.write(html, function() {
    stream.close(callback);
  });

}

function renderHtml(resumeJson, theme){
  var themePkg = require(theme);
  return themePkg.render(resumeJson);
}

function createPdf(resumeJson, fileName, theme, format, callback) {
    var html = renderHtml(resumeJson, theme);
    pdf.create(html, {format: 'Letter'}).toFile(fileName + format, callback);
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
