var version = require('./version');
var init = require('./init');
var test = require('./test');
var publish = require('./publish');
var register = require('./register');
var exportResume = require('./exportResume');
var settings = require('./settings');
var serve = require('./serve');
var login = require('./login');
var waterfallArray = require('./waterfallArray');

module.exports = {
    init: init,
    test: test,
    publish: publish,
    register: register,
    exportResume: exportResume,
    settings: settings,
    serve: serve,
    version: version,
    login: login,
    waterfallArray: waterfallArray
};