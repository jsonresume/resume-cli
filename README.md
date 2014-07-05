resume-cli
==========

    npm install -g resume-cli

 [![Build Status](https://api.travis-ci.org/jsonresume/resume-cli.svg)](http://travis-ci.org/jsonresume/resume-cli)


#Usage

    resume init

Creates a new resume.json file with a blank schema in your current working directory.    

Then open the resume.json in your text editor following the schema available at: [jsonresume.org](http://jsonresume.org/)

    resume test

Runs your resume.json through our schema tests to ensure it complies with the jsonresume standard.

    resume export [myresume.extension]

Exports your resume locally into a styled html, markdown, text, or pdf file.

To select one of the available themes use the `--theme <theme>`

Example `resume export myresume.html --theme crisp`
  

    resume register

Registration is optional, 
To publish your resume with a custom domain extension at jsonresume.org you will first need to acquire login credentials. 


    resume publish




