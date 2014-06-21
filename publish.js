var request = require('superagent');
var open = require('open');

function publish(resumeData) {
    // if (validate()) {
    request
        .post('http://beta.jsonresume.org/resume')
        .send({
            resume: resumeData
        })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, res) {
            console.log(res.body);
            open(res.body.url);
        });
    return;
    // }
}
module.exports = publish;