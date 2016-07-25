module.exports = {
    username: function(username) {
        var re = /^[^_-][a-zA-Z0-9\-_]{2,30}$/;
        if (re.test(username)) {
            return;
        }
        console.log('Username may only contain alphanumeric characters, underscores or dashes, must be at least 3 characters, and cannot begin with a dash or underscore.'.red);
        // must be over 2 characters
        process.exit();
    },
    email: function(email) {
        var re = /\S+@\S+\.\S+/;
        if (re.test(email)) {
            return;
        }
        console.log('Email format is invalid.'.red);
        process.exit();
    },
    passwords: function(password1, password2) {
        if (password1 === password2) {
            return;
        }
        console.log('Your passwords did not match, try again.'.red);
        process.exit();
    }
};
