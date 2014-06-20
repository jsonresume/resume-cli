var fs = require('fs');
var resumeToText = require('..');

var resumeInput = process.argv[2]; //value will be "banana"  for testing
var resumeOutput = process.argv[3];

var resumeData = JSON.parse(fs.readFileSync(resumeInput, 'utf8'));

resumeToText(resumeData, function(TextResume) {
    fs.writeFileSync(resumeOutput, TextResume, 'utf8');
});