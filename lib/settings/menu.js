exports.main = function(callback) {
  var menu = require('terminal-menu')({
    width: 29,
    x: 4,
    y: 2,
    bg: 'black',
    fg: 'cyan'
  });
  menu.reset();
  menu.write('SETTINGS\n');
  menu.write('-------------------------\n');
  menu.add('CHANGE THEME');
  menu.add('CHANGE PASSWORD');
  menu.add('DELETE ACCOUNT');
  menu.write('------------------------------\n');
  menu.add('EXIT');
  menu.on('select', function(setting) {
    menu.close();
    console.log('SELECTED: ' + setting);
    if (setting === 'EXIT') {
      return;
    }
    callback(setting);
  });

  process.stdin
    .pipe(menu.createStream())
    .pipe(process.stdout); //create key stream
  process.stdin.setRawMode(true); //listen for keys
};

exports.theme = function(callback) {
  var menu = require('terminal-menu')({
    width: 29,
    x: 4,
    y: 2,
    bg: 'black',
    fg: 'cyan'
  });
  menu.reset();
  menu.write('SETTINGS\n');
  menu.write('-------------------------\n');
  menu.add('flat');
  menu.add('modern');
  menu.add('elegant');
  menu.add('ADD THEME');
  menu.write('------------------------------\n');
  menu.add('EXIT');
  menu.on('select', function(theme) {
    menu.close();
    console.log('SELECTED: ' + theme);
    if (theme === 'EXIT') {
      return;
    }
    callback(theme);
  });

  process.stdin
    .pipe(menu.createStream())
    .pipe(process.stdout);
  process.stdin.setRawMode(true); //listen for keys

  // TODO add ADD THEME input here
};
