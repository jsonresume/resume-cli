resume-cli
==========

[![Build Status](https://api.travis-ci.org/jsonresume/resume-cli.svg)](http://travis-ci.org/jsonresume/resume-cli)

#install

    npm install -g resume-cli



#Usage

	resume --help

For a complete list of options and commands.


    resume init

Creates a new resume.json file with a blank schema in your current working directory.    

From here you can complete the resume.json in your text editor following the schema available at: [jsonresume.org](http://jsonresume.org/)

  
    resume test

Runs your resume.json through our schema tests to ensure it complies with the jsonresume standard and tries to identify where any errors may be occurring.

    
    resume export [myresume.extension]

Exports your resume locally in a stylized html, markdown, or pdf format.

To select one of the available themes use the `--theme <theme name>` flag.
Themes available are: crisp, traditional, modern, (more to come).

Example: `resume export myresume.html --theme modern`
  
    
    resume register

Registration is optional.
To publish your resume to your account with a custom domain extension at [registry.jsonresume.org](http://registry.jsonresume.org/), you will first need to acquire login credentials. 

   
    resume publish

This command will guide you through the publish process.
Consider using the theme flag to style your resume (Defaults to modern).

Example: `resume export --theme traditional`

