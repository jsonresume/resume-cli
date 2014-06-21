var ZSchema = require("z-schema");
var fs = require('fs');
var path = require('path');


// TODO - Remove this sync call
var schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'schema.json'), 'utf8'));



function validate(resumeJson, callback) {
	ZSchema.validate(resumeJson, schema)
	  .then(function(report){
	  	callback(report, null);
	  })
	  .catch(function(err){
	  	callback(null, err);
	  })
}
module.exports = {
	validate: validate
}

