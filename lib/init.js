const fs = require('fs');
const read = require('read');
const resumeJson = require('resume-schema/sample.resume.json');
const chalk = require('chalk'); // slowly replace colors with chalk

const fillInit = () => {
  console.log(
    '\nThis utility will generate a resume.json file in your current working directory.',
  );
  console.log(
    'Fill out your name and email to get started, or leave the fields blank.',
  );
  console.log('All fields are optional.\n');
  console.log('Press ^C at any time to quit.');

  read(
    {
      prompt: 'name: ',
    },
    (err, name) => {
      if (err) {
        console.log();
        process.exit();
      }

      read(
        {
          prompt: 'email: ',
        },
        (err, email) => {
          if (err) {
            console.log();
            process.exit();
          }

          resumeJson.basics.name = name;
          resumeJson.basics.email = email;

          fs.writeFileSync(
            process.cwd() + '/resume.json',
            JSON.stringify(resumeJson, undefined, 2),
          );

          console.log('\nYour resume.json has been created!'.green);
          console.log('');
          console.log(
            'To generate a formatted .html .md .txt or .pdf resume from your resume.json',
          );
          console.log(
            'type: `resume export [someFileName]` including file extension eg: `resume export myresume.html`',
          );
          console.log(
            '\nYou can optionally specify an available theme for html and pdf resumes using the --theme flag.',
          );
          console.log('Example: `resume export myresume.pdf --theme even`');
          console.log(
            'Or simply type: `resume export` and follow the prompts.',
          );
          console.log('');

          process.exit();
        },
      );
    },
  );
};

const init = () => {
  if (fs.existsSync('./resume.json')) {
    console.log(
      chalk.yellow('There is already a resume.json file in this directory.'),
    );
    read(
      {
        prompt: 'Do you want to override? [y/n]:',
      },
      (err, answer) => {
        if (err) {
          console.log();
          process.exit();
        }
        if (answer === 'y') {
          fillInit();
        } else {
          process.exit();
        }
      },
    );
  } else {
    fillInit();
  }
};

module.exports = init;

//todo: fix success wording
