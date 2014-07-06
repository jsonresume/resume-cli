function settings() {
    mainMenu(function(setting) {


        switch (setting) {
            case 'CHANGE THEME':
                themeMenu(function(theme) {
                    console.log(theme);
                });


                break
            case 'DELETE ACCOUNT':





                break



        }



        console.log(setting);
    });
}




function publishSend(resumeJson, theme, email, password, guest, passphrase) {
    request
        .post(registryServer + '/resume')
        .send({
            theme: theme,
            email: email,
            password: password,
        })
        .set('X-API-Key', 'foobar')
        .set('Accept', 'application/json')
        .end(function(error, res) {
            // cannot read property of null
            if (error && error.code === 'ENOTFOUND') {
                console.log('\nThere has been an error publishing your resume.'.red);
                console.log('Please check your network connection.'.cyan);
                process.exit();
                return;
            } else if (error || res.body.message === 'ERRORRRSSSS') {
                spinner.stop();
                console.log('\nThere has been an error publishing your resume.'.red);
                // console.log('Details:', error, res.body.message);
                console.log('Please check you are using correct login details.'.blue);
            } else {
                spinner.stop();
                console.log("\nSuccess! Your resume is now published at:".green, res.body.url);
                read({
                    prompt: 'Would you like to open your newly published resume in the web browser? [y/n]: '
                }, function(er, answer) {
                    if (answer === 'y') {
                        open(res.body.url);
                        process.exit();
                    } else if (answer === 'n') {
                        process.exit();
                    }
                });
            }
        });
    return;
}









function mainMenu(callback) {
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
    menu.add('DELETE ACCOUNT');
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.on('select', function(setting) {
        menu.close();
        console.log('SELECTED: ' + setting);

        callback(setting);

    });
    menu.createStream().pipe(process.stdout);
}


function themeMenu(callback) {
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
    menu.add('TRADITIONAL');
    menu.add('MODERN');
    menu.add('CRISP');
    menu.write('------------------------------\n');
    menu.add('EXIT');
    menu.on('select', function(theme) {
        menu.close();
        console.log('SELECTED: ' + theme);
        callback(theme);
    });
    menu.createStream().pipe(process.stdout);
}



module.exports = settings;