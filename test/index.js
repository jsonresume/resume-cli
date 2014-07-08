var lib = require('../lib');
var test = require('tape');
var fs = require('fs');

var resumeJson = {
    "bio": {
        "name": "test",
        "email": "test@test"
    }
};

test('export a test.html, test for existence, then delete.', function(t) {
    lib.exportResume(resumeJson, 'test.html', {
        theme: 'modern'
    }, function(res) {
        t.ok(res, 'exportResume() returns successful response.');
        t.ok(fs.existsSync('./test.html'), 'test.html exists.');
        fs.unlink('./test.html', function(err) {
            err && t.fail('unlink is throwing an error');
            t.notOk(fs.existsSync('./test.html'), 'test.html is gone.');
            t.end();
        });
    });
});