var should = require('should');
var registerUser = require('../lib/register/register-user');
var deleteUser = require('../lib/settings/delete-user');

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

    it('should delete users', function(done) {

        deleteUser({
            email: user.email,
            password: user.password
        }, function(err, res) {
            should.not.exist(err);

            done();
        });
    });
});
