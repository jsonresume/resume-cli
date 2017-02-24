var themeServer = process.env.THEME_SERVER || 'https://themes.jsonresume.org/theme/';
var registryServer = process.env.REGISTRY_SERVER || 'https://registry.jsonresume.org';
var request = require('superagent');
var http = require('http');
var fs = require('fs');
var path = require('path');
var read = require('read');
var spinner = require("char-spinner");
var chalk = require('chalk');
var pdf = require('html-pdf');

var SUPPORTED_FILE_FORMATS = ["html", "pdf"];
var SUPPORTED_PAPER_SIZE = ["A3", "A4", "A5", "Legal", "Letter", "Tabloid"];

module.exports = function exportResume(resumeJson, fileName, program, callback) {
  var theme = program.theme;
  if(!theme.match('jsonresume-theme-.*')){
    theme = 'jsonresume-theme-' + theme;
  }

  if (!fileName) {
    console.error("Please enter a export destination.");
    process.exit(1);
  }

  var paper = program.paper;
  if (SUPPORTED_PAPER_SIZE.indexOf(paper) === -1) {
    console.error("Unsupported paper size:" + paper + ".");
    process.exit(1);
  }

    var fileNameAndFormat = getFileNameAndFormat(fileName, program.format);
    fileName = fileNameAndFormat.fileName;
    var fileFormatToUse = fileNameAndFormat.fileFormatToUse;
    var format = "." + fileFormatToUse;
    if (format === '.html') {
      createHtml(resumeJson, fileName, theme, format, function() {
        callback(null, fileName, format);
      });
    }
    else if (format === '.pdf') {
      createPdf(resumeJson, fileName, theme, format, paper, function() {
          callback(null, fileName, format);
      });
    }

    else {
      console.error(`JSON Resume does not support the ${format} format`);
      process.exit(1);
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
  var contents = '';
  try {
    var themePkg = require(theme);
  } catch (err) {
    // Theme not installed
    console.log('You have to install this theme globally to use it e.g. `npm install -g ' + theme + '`')
    process.exit();
  }
  contents = themePkg.render(resumeJson);
  return contents;
}

function createPdf(resumeJson, fileName, theme, format, paper, callback) {
    var html = renderHtml(resumeJson, theme);
    pdf.create(html, {format: paper}).toFile(fileName + format, callback);
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

  return {
    fileName: fileName,
    fileFormatToUse: fileFormatToUse
  };
}
