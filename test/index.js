var lib = require('../lib');
var test = require('tape');
var fs = require('fs');

var resumeJson = {
    "name": "test",
    "email": "test@test"
};

test('export a test.html, test for existence, then delete.', function(t) {
    lib.exportResume(resumeJson, 'test.html', function(res) {
        t.ok(res, 'exportResume() returns successful response.');
        t.ok(fs.existsSync('./test.html'), 'test.html exists.');
        fs.unlink('./test.html', function(err) {
            err && t.fail('unlink is throwing an error');
            t.notOk(fs.existsSync('./test.html'), 'test.html is gone.');
            t.end();
        });
    });
});

// test('export test.txt and test for existence, then delete.', function(t) {
//     lib.exportResume(resumeJson, 'test.txt', function(res) {
//         t.ok(res, 'exportResume() returns successful response.');
//         t.ok(fs.existsSync('./test.txt'), 'test.txt exists.');
//         //now delete test.txt
//         fs.unlink('./test.txt', function(err) {
//             if (err) throw err;
//             t.notOk(fs.existsSync('./test.txt'), 'test.txt is gone.');
//             t.end();
//         });
//     });
// });