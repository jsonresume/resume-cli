var read = require('read');
var async = require('async');
var menu = require('./menu');
var changeTheme = require('./change-theme');
var changePassword = require('./change-password');
var deleteUser = require('./delete-user');

module.exports = function settings(resumeJson, program, config) {

  var defaultEmail = resumeJson && resumeJson.basics.email || '';

  menu.main(function(setting) {

    switch (setting) {
      case 'CHANGE THEME':

        menu.theme(function(theme) {

          async.series({
            theme: function(next) {
              // if ADD THEME was not selected, skip this step
              if (theme !== 'ADD THEME') {
                return next(null, theme);
              }

              read({
                prompt: "Enter theme name: "
              }, function(err, theme) {

                // TODO write theme to config
                next(err, theme);
              });
            },
            session: function(next) {
              var session = config && config.session;

              if (!session) {
                // if no user session, take next step and login using email and password
                return next(null, null)
              }
              // if there was a stored session, break out of the series and use session data to log in.
              next('break', session);
            },
            email: function(next) {
              read({
                prompt: "Email: ",
                default: defaultEmail
              }, function(err, email) {
                next(err, email);

              });
            },
            password: function(next) {
              read({
                prompt: "Password: ",
                silent: true
              }, function(err, password) {

                next(err, password);
              });
            }
          }, function(err, results) {
            // set the changeTheme flag for the registry server
            var hasSession = results.session;
            if (hasSession) {
              // fetch the corresponding email to the session token
              results.email = config.email;
            }

            if (err && !hasSession) {
              console.log();
              process.exit();
            }

            changeTheme(results);
          });
        });

        break;

      case 'CHANGE PASSWORD':

        async.series({
          email: function(next) {
            read({
              prompt: "Email: ",
              default: defaultEmail
            }, function(err, email) {

              next(err, email)
            });
          },
          currentPassword: function(next) {
            read({
              prompt: "Current Password: ",
              silent: true
            }, function(err, currentPassword) {

              next(err, currentPassword);
            });
          },
          newPassword: function(next) {
            read({
              prompt: "New Password: ",
              silent: true
            }, function(err, newPassword) {

              next(err, newPassword);
            });
          },
          confirmPassword: function(next) {
            read({
              prompt: "Confirm Password: ",
              silent: true
            }, function(err, confirmPassword) {

              next(err, confirmPassword);
            });
          }
        }, function(err, results) {
          if (err) {
            console.log();
            process.exit();
          }

          if (results.newPassword !== results.confirmPassword) {
            console.log('Your new password does not match the confirmed password. Try again.');
            process.exit();
          }

          changePassword(results);
        });
        break;

      case 'DELETE ACCOUNT':

        async.series({
          email: function(next) {
            read({
              prompt: "Email: ",
              default: defaultEmail
            }, function(err, email) {
              next(err, email);
            });
          },
          password: function(next) {
            read({
              prompt: "Password: ",
              silent: true
            }, function(err, password) {
              next(err, password);
            });
          }
        }, function(err, results) {
          if (err) {
            console.log();
            process.exit();
          }

          read({
            prompt: 'Are you sure you want to delete your JsonResume.org account? [y/n]: '
          }, function(err, answer) {
            if (answer === 'y') {
              deleteUser(results);
            } else if (answer === 'n') {
              process.exit();
            }
          });
        });
        break;


    }
  });
};
