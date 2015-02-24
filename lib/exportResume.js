var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';

var request = require('superagent');
var http = require('http');
var fs = require('fs');
var path = require('path');
var read = require('read');
var spinner = require("char-spinner");

function exportResume(resumeJson, fileName, program, callback) {
    var file, 
        format,
        exportFn = sendExportRequest, // default .html export function
        theme = program.theme;
    var processFile = function(er, f) {
        if (er) return console.error('Error exporting file', er, 'File:', f);
        format = path.extname(f);
        if ( !format || format.length <= 0 ) { 
            format = '.html';
        } else if (format.indexOf('htm') >  -1) {
            format = '.html';
        } else {
            console.log('PDF Format selected...');
            format = '.pdf';
        }
        file = f;
        file = file.indexOf('.') > -1 ? file : file + format;
        exportFn = format === '.html' ? sendExportRequest : sendExportPDFRequest;

        exportFn(resumeJson, file, theme, format, function _saveResult() {
            callback(null, file, format);
        });
    };
    if (!fileName) {
        read({
            prompt: "Provide a file name: ",
            default: 'resume'
        }, processFile);
    } else {
        processFile(null, fileName);
    }
}

function sendExportRequest(resumeJson, fileName, theme, format, callback) {
    spinner();
    request
        .post(themeServer + theme)
        .send({
            resume: resumeJson
        })
        .set('Accept', 'application/json')
        .end(function(response) {
            fs.writeFileSync(path.resolve(process.cwd(), fileName), response.text);
            callback();
        });
    return;
}

function sendExportPDFRequest(resumeJson, fileName, theme, format, callback) {
    spinner();
    var stream = fs.createWriteStream(path.resolve(process.cwd(), fileName));
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

module.exports = exportResume;
