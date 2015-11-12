'use strict';

var fs = require('fs');
var jsonlint = require('jsonlint');

function parseJSON(data, callback) {
      try {
        jsonlint.parse(String(data));
        var resumeJson = JSON.parse(data);

        callback(null, resumeJson);
      } catch (error) {
        callback(error);
      }
}

function loadFile(callback) {
  fs.readFile('./resume.json', function(resumeJsonDoesNotExist, data) {
    if (resumeJsonDoesNotExist) {
      if (['export', 'publish', 'test'].indexOf(process.argv[2]) !== -1) { // removed serve. test this later
        console.log('There is no resume.json file located in this directory');
        console.log('Type: `resume init` to initialize a new resume');
        return;
      }

      var resumeJson = false;
      callback(null);
    } else {
      parseJSON(data, callback);
    }
  });
}

module.exports = function getResume(callback) {
  var stdStream = [];
  var stdin = process.stdin;

  if (Boolean(process.stdin.isTTY)) {
    loadFile(callback);
  } else {
    stdin.on('data', function (chunk) {
      stdStream.push(chunk);
    })
    .on('end', function () {
      parseJSON(stdStream.join(''), callback);
    })
  }
};
