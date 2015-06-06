var should = require('should');
var registerUser = require('../lib/register/register-user');
var deleteUser = require('../lib/settings/delete-user');
var publishResume = require('../lib/publish/publish-resume');


describe('Register tests', function() {
    this.timeout(3000);

    var user = {
        username: 'test1',
        email: 'test1@test1.com',
        password: 'test1'
    };

    it('should register user', function(done) {

        registerUser(user, function(err, res) {
            should.not.exist(err);
            user.username.should.be.exactly(res.username);
            user.email.should.be.exactly(res.email);

            done();
        });
    });

    it('should publish guest resume', function(done) {

        var resumeJson = require('./resume.json');
        var theme = 'flat'
        var email = null;
        var password = null;
        var guest = true;
        var resumePassword = false;
        var session = null;

        publishResume(resumeJson, theme, email, password, guest, resumePassword, session, function(err, res) {
            should.not.exist(err);
            res.body.should.have.property('url');

            done();
            // remove geust resume
        });
    });

    it('should delete user', function(done) {

        deleteUser({
            email: user.email,
            password: user.password
        }, function(err, res) {
            should.not.exist(err);

            done();
        });
    });
});
