resume-cli
==========

    npm install -g resume-cli

 [![Build Status](https://api.travis-ci.org/jsonresume/resume-cli.svg)](http://travis-ci.org/jsonresume/resume-cli)


#Usage

	resume --help


	  Usage: resume [options] [command]

	  Commands:

	    init                   Initialize a resume.json file
	    test                   Test resume.json
	    export [fileName]      Export locally to .html, .txt or .pdf
	    register               register at registry.jsonresume.org
	    publish                Publish resume.json at:

	  Options:

	    -h, --help          output usage information
	    -V, --version       output the version number
	    -f, --force         Force publish
	    -t, --theme <type>  resume export myresume.html --theme <modern>


    resume init

Creates a new resume.json file with a blank schema in your current working directory.    

From here you can complete the resume.json in your text editor following the schema available at: [jsonresume.org](http://jsonresume.org/)

    resume test

Runs your resume.json through our schema tests to ensure it complies with the jsonresume standard and tries to identify where any errors are occurring.

    resume export [myresume.extension]

Exports your resume locally in a stylized html, markdown, text, or pdf format.

To select one of the available themes use the `--theme <theme>` flag.

Example: `resume export myresume.pdf --theme crisp`
Example: `resume export myresume.html --theme traditional`
Example: `resume export myresume.html --theme modern`
  
    resume register

Registration is optional.
To publish your resume to your account with a custom domain extension at [registry.jsonresume.org](http://registry.jsonresume.org/), you will first need to acquire login credentials. 


    resume publish

This will command will guide you through the publish process. You will have options to publish as a ge


