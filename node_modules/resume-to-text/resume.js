var fs = require('fs');
var Mustache = require('mustache');
var _ = require('lodash');


var resumeInput = process.argv[2]; //value will be "banana"
var resumeOutput = process.argv[3];

var resumeTemplate = fs.readFileSync('layout.template', 'utf8');
var resumeData = JSON.parse(fs.readFileSync(resumeInput, 'utf8'));

var resumeHTML = Mustache.render(resumeTemplate, resumeData);

fs.writeFileSync(resumeOutput, resumeHTML, 'utf8');
