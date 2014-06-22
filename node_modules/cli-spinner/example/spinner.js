//var Spinner = require('cli-spinner').Spinner; <- if you use npm
var Spinner = require('../index.js').Spinner;

var spinner = new Spinner(': default spinner instance');
spinner.start();
setTimeout(function() {
    spinner.stop();
    process.stdout.write('\n');

    spinner = new Spinner(': using instance spinner string');

    // set default spinner string for just this instance
    spinner.setSpinnerString('▉▊▋▌▍▎▏▎▍▌▋▊▉');

    spinner.start();

    setTimeout(function() {
        spinner.stop();
	process.stdout.write('\n');

	// set default spinner string for all new instances
	Spinner.setDefaultSpinnerString('.oO@*');

	spinner = new Spinner(': press ctrl-c to stop');
	spinner.start();
    },5000);
},5000);
