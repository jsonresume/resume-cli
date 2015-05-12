var should = require('should');
var registerUser = require('../lib/register/register-user');
var deleteUser = require('../lib/settings/delete-user');

describe('Register tests', function() {

    it('should register new user', function(done) {


        var user = {
            username: 'test1',
            email: 'test1@test1.com',
            password: 'test1'
        };

        after(function(done) {
            deleteUser({
                email: user.email,
                password: user.password
            }, function(err, res) {
                console.log('deleteuser response', err, res);
                done();
            });
        });

        registerUser(user, function(err, res) {
            should.not.exist(err);
            user.username.should.be.exactly(res.username);
            user.email.should.be.exactly(res.email);

            done();
        });
    });

    it.only('should error if username is taken', function(done) {

        var user = {
            username: 'test1',
            email: 'test1@test1.com',
            password: 'test1'
        };

        before(function(done) {
            registerUser(user, function(err, res) {
                should.not.exist(err);
                user.username.should.be.exactly(res.username);
                user.email.should.be.exactly(res.email);

                done();
            });
        });
        after(function(done) {
            deleteUser({
                email: user.email,
                password: user.password
            }, function(err, res) {
                console.log('deleteuser response', err, res);
                done();
            });
        });

		registerUser(user, function(err, res) {
			console.log('does this even run', err, res);

			done();
		});

    });
});


// todo delete user test without resume.json
