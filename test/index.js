var should = require('should');
var registerUser = require('../lib/register/register-user');
var changeTheme = require('../lib/settings/change-theme');
var changePassword = require('../lib/settings/change-password');
var deleteUser = require('../lib/settings/delete-user');
var publishResume = require('../lib/publish/publish-resume');
var loginRequest = require('../lib/login/login-request');

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

  it('should receive a Successful login response', function(done) {

    loginRequest({
      email: user.email,
      password: user.password
    }, function(err, res){
      should.not.exist(err);
      res.body.should.have.property('message', 'loggedIn');

      done();
    });

  });

  it('should change theme', function(done) {

    changeTheme({
      email: user.email,
      password: user.password,
      theme: 'flat',
      changeTheme: true
    }, function(err, res) {

      should.not.exist(err);

      console.log(err, res.body);

      done();
    });
  });

  it('should change password', function(done) {

    var newPassword = 'arbitraryString';

    var data = {
      email: user.email,
      currentPassword: user.password,
      newPassword: newPassword,
      confirmPassword: newPassword
    };

    // update password on user object
    user.password = newPassword;

    changePassword(data, function(err, res) {
      should.not.exist(err);
      res.statusCode.should.be.exactly(200);
      res.body.should.have.property('message', 'password updated');

      console.log(err, res.statusCode, res.body);

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
