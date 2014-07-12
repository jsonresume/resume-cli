var fs = require('fs');
var http = require('http');
var open = require('open');
var resumeToHtml = require('resume-to-html');
var Spinner = require('cli-spinner').Spinner;

module.exports = function(port, theme, silent) {
	var file = './resume.json';
	if (!fs.existsSync(file)) {
		console.log(file + ' could not be found');
		return;
	}
	http.createServer(function (req, res) {
		fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
			var json;
			try {
				json = JSON.parse(data);
			} catch(err) {
				var msg = 'Parse error: ' + file;
				res.writeHead(404);
				res.end(msg);
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				console.log(msg);
				return;
			}
			res.writeHead(
				200,
				{'Content-Type': 'text/html'}
			);
			resumeToHtml(json, {theme: theme}, function(html) {
				res.end(html);
			});
		});
	}).listen(port);
	
	console.log('');
	var previewUrl = "http://localhost:" + port;
	console.log('Preview: ' + previewUrl);
	console.log('Press ctrl-c to stop')
	console.log('');

	if(!silent) {
		open(previewUrl);
	}

	var spinner = new Spinner('serving...');
	spinner.start();
};
