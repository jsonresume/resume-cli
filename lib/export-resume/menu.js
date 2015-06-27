exports.extension = function (format, callback) {
    if (format) {
      callback('.' + format);
    } else {
      var Menu = require('terminal-menu');
      var menu = Menu({ width: 29, x: 4, y: 2, bg: 'black', fg: 'cyan' });
      menu.reset();
      menu.write('Select file format for export\n');
      menu.write('-------------------------\n');
      menu.add('.html');
      // menu.add('.md');
      // menu.add('.txt');
      menu.add('.pdf');
      menu.on('select', function(format) {
        menu.close();
        console.log('SELECTED: ' + format);
        callback(format);
      });
      process.stdin
        .pipe(menu.createStream())
        .pipe(process.stdout); //create key stream
      process.stdin.setRawMode(true); //listen for keys
    }
};
