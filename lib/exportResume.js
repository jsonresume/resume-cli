var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';

var request = require('superagent');
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
            console.log('PDF selected...')
            format = '.pdf';
        }
        // file = path.basename(f);
        file = f;
        file = file.indexOf('.') > -1 ? file : file + format;
        // console.log('File', file)
        // formatSelectMenu(file.format, function(format) {
        exportFn = format === '.html' ? sendExportRequest : sendExportPDFRequest;

        exportFn(resumeJson, file, theme, format, function _saveResult() {
            callback(null, file, format);
        });
        // });
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

// function formatSelectMenu(format, callback) {
//     if (format) {
//         callback('.' + format);
//     } else {
//         var menu = require('terminal-menu')({
//             width: 29,
//             x: 4,
//             y: 2,
//             bg: 'black',
//             fg: 'cyan'
//         });
//         menu.reset();
//         menu.write('Select file format for export\n');
//         menu.write('-------------------------\n');
//         menu.add('.html');
//         // menu.add('.md');
//         // menu.add('.txt');
//         menu.add('.pdf');
//         menu.on('select', function(format) {
//             menu.close();
//             console.log('SELECTED: ', format);
//             callback(format);
//         });
//         menu.createStream().pipe(process.stdout);
//     }
// }

// function getFileNameAndFormat(fileName) {
//     var format = path.extname(fileName),
//         f = path.basename(fileName, format);
//     format = format.length > 1 ? format : DEFAULT_FORMAT;
//     f = (f.indexOf('.') > -1 ? f.substring(0, f.lastIndexOf('.')) : f);
//     f = (!f || f.length <= 0 ? fileName : f);// if blank, revert

//     return {
//         'name': f, 
//         'format': format
//     };
// }

module.exports = exportResume;
