var readline = require('readline');
var fs = require('fs');
var async = require('async');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

resume = {};

async.series([

    function(callback) {
        rl.question("name: ", function(name) {
            resume.name = name;
            callback();
        });
    },
    function(callback) {
        rl.question("email: ", function(email) {
            resume.email = email;
            callback()
        });
    },
    function(callback) {
        rl.question("github: ", function(github) {
            resume.github = github;
            console.log(resume)
            callback()
        });
    }
]);