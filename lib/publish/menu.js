//publish menu
var customPublish = 'Publish to your account.';
var guestPublish = 'Publish as guest.';
var encriptedCustom = 'Publish to your account (password access).';
var encriptedGuest = 'Publish as guest (password access).';

exports.publish = function(callback) {
  var menu = require('terminal-menu')({
    width: 35,
    x: 4,
    y: 2,
    bg: 'black',
    fg: 'cyan'
  });
  menu.reset();
  menu.write('        PUBLISH MENU\n');
  menu.write('------------------------------\n');
  menu.add(customPublish);
  menu.add(guestPublish);
  menu.add(encriptedCustom);
  menu.add(encriptedGuest);
  menu.write('------------------------------\n');
  menu.add('EXIT');
  menu.write('\n');
  menu.write('To acquire account details, press ^C and type: `resume register`\n'.white);
  menu.write('Or just publish as guest.'.white);
  menu.on('select', function(option) {
    menu.close();
    console.log('\nSELECTED: ' + option);
    if (option === 'EXIT') {
      return;
    } else {
      callback(option);
    }
  });

  process.stdin
    .pipe(menu.createStream())
    .pipe(process.stdout); //create key stream
  process.stdin.setRawMode(true); //listen for keys
};
