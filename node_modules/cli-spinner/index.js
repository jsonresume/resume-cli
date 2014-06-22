var defaultSpinnerString = '|/-\\';

var Spinner = function(textToShow){
  this.text = textToShow || '';
  this.setSpinnerString(defaultSpinnerString); // use default spinner string
};

Spinner.setDefaultSpinnerString = function(value) {
  defaultSpinnerString = value;
};

Spinner.prototype.start = function() {
  var current = 0;
  var self = this;
  this.id = setInterval(function() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(self.chars[current] + ' ' + self.text);
    current = ++current % self.chars.length;
  }, 200);
};

Spinner.prototype.setSpinnerString = function(str) {
  this.chars = str.split("");
};

Spinner.prototype.stop = function() {
  clearInterval(this.id);
};

exports.Spinner = Spinner;
