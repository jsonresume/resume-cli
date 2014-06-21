# z-schema validator

[![NPM version](https://badge.fury.io/js/z-schema.png)](http://badge.fury.io/js/z-schema)
[![Dependency Status](https://david-dm.org/zaggino/z-schema.png?theme=shields.io)](https://david-dm.org/zaggino/z-schema)

JSON Schema validator for Node.js (draft4 version)

Coded according to:

[json-schema documentation](http://json-schema.org/documentation.html),
[json-schema-core](http://json-schema.org/latest/json-schema-core.html),
[json-schema-validation](http://json-schema.org/latest/json-schema-validation.html),
[json-schema-hypermedia](http://json-schema.org/latest/json-schema-hypermedia.html)

Passing all tests here (even optional, except zeroTerminatedFloats and some URI tests, see more info in [#18](https://github.com/zaggino/z-schema/issues/18)):

[json-schema/JSON-Schema-Test-Suite](https://github.com/json-schema/JSON-Schema-Test-Suite)

Will try to maintain this as much as possible, all bug reports welcome.

### Grunt automatization

If you need to automatize validation of your schemas, there's a Grunt plugin [grunt-z-schema](https://github.com/petrbela/grunt-z-schema) by [Petr Bela](https://github.com/petrbela)

### How does it compare to others?

[rawgithub.com/zaggino/z-schema/master/benchmark/results.html](https://rawgithub.com/zaggino/z-schema/master/benchmark/results.html)

## Basic Usage

```javascript
var ZSchema = require("z-schema");
```

```javascript
ZSchema.validate(json, schema)
    .then(function(report){
        // successful validation
        // there might be warnings: console.log(report.warnings)
    })
    .catch(function(err){
        console.error(err.errors)
    })
```

There is also support for _sync_ mode like this:
```javascript
var validator = new ZSchema({ sync: true });
var valid = validator.validate(json, schema);
if (!valid) {
    var error = validator.getLastError();
}
```

Using traditional callback:
```javascript
ZSchema.validate(json, schema, function(err, report){
    if(err){
        console.error(err.errors);
        return;
    }
    // successful validation
    // there might be warnings: console.log(report.warnings)
})
```

If you need just to validate your schema, you can do it like this:

```javascript
var validator = new ZSchema();
validator.validateSchema(schema)
    .then(function(report){
    })
    .catch(function(err){
    })
```

Or with Node.js style callback:

```javascript
var validator = new ZSchema();
validator.validateSchema(schema, function (err, report) {
    if (err) ...
});
```

## Remote references in schemas

Your schemas can include remote references that should be real URIs ([more on that here](http://json-schema.org/latest/json-schema-core.html#anchor22))
so validator can make a request and download the schema needed. Validator automatically
caches these remote requests so they are not repeated with every validation.

In case you don't have a real server or you'd like to load files from different location,
you can preload remote locations into the validator like this:

```javascript
var fileContent = fs.readFileSync(__dirname + '/../json_schema_test_suite/remotes/integer.json', 'utf8');
ZSchema.setRemoteReference('http://localhost:1234/integer.json', fileContent);
```

```http://localhost:1234/integer.json``` doesn't have to be online now, all schemas
referencing it will validate against ```string``` that was passed to the function.

## Advanced Usage

You can pre-compile schemas (for example on your server startup) so your application is not
bothered by schema compilation and validation when validating ingoing / outgoing objects.

Promises:

```javascript
var validator = new ZSchema();
validator.compileSchema(schema)
    .then(function(compiledSchema){
    })
```

Or callback:

```javascript
var validator = new ZSchema();
validator.compileSchema(schema, function (err, compiledSchema) {
    assert.isUndefined(err);
    ...
});
```

Then you can re-use compiled schemas easily just the same way as non-compiled.

```javascript
var validator = new ZSchema();
validator.validate(json, compiledSchema)
    .then(function(report){
        // ...
    })
    .catch(function(err){
        console.error(err.errors)
    })
```

## Custom format validators

You can add validation for your own custom string formats like this:
(these are added to all validator instances, because it would never make sense to have multiple
functions to validate format with the same name)

```javascript
var validator = new ZSchema();

ZSchema.registerFormat('xstring', function (str) {
    return str === 'xxx'; // return true/false as a result of validation
});

validator.validate('xxx', {
    'type': 'string',
    'format': 'xstring'
})
.then(function(){})
.catch(function(err){})
```

Custom validators can also be async:

Using promises:

```javascript
ZSchema.registerFormat('xstring', function (str) {
    return Q.delay(1000).thenResolve(return str === 'xxx'); // return a promise for validation result
});
```

Using classic callback:

```javascript
ZSchema.registerFormat('xstring', function (str, callback) {
    setTimeout(function(){
        callback(null, str === 'xxx');
        // or return custom error: callback(new Error('Bad, bad value!'))
    }, 2000)
});
```

Any exception thrown (or returned via classic callback) in custom validation function is written into validation error:
```javascript
ZSchema.registerFormat('xstring', function (str) {
    throw new Error('Bad, bad value!');
});
```
And then expect errors to contain something like this:

```
[{ code: 'FORMAT',
    message: 'xstring format validation failed: Error: Bad, bad value!',
    path: '#/test',
    params: { format: 'xstring', error: [Error: Bad, bad value!] } } ]
```


## Strict validation

When creating new instance of validator, you can specify some options that will alter the validator behaviour like this:

```javascript
var validator = new ZSchema({
    option: true
});
```

* noExtraKeywords: ```true/false```

when true, do not allow unknown keywords in schema

* noZeroLengthStrings: ```true/false```

when true, always adds minLength: 1 to schemas where type is string

* noTypeless: ```true/false```

when true, every schema must specify a type

* forceAdditional: ```true/false```

when true, forces not to leave out some keys on schemas (additionalProperties, additionalItems)

* forceProperties: ```true/false```

when true, forces not to leave out properties or patternProperties on type-object schemas

* forceItems: ```true/false```

when true, forces not to leave out items on array-type schemas

* forceMaxLength: ```true/false```

when true, forces not to leave out maxLength on string-type schemas, when format or enum is not specified

__Alternatively__, you can turn on all of the above options with:

```javascript
var validator = new ZSchema({
    strict: true
});
```

## More options

* noSchemaCache: ```true/false```

when true, disables caching of compiled schemas - cache is used to resolve references to other schemas by their ID

* strictUris: ```true/false```

when true, uri's need to be in full rfc3986 format, by default checks for uri-fragment, more info in [#18](https://github.com/zaggino/z-schema/issues/18)

# Pull requests

Avoid JSHint errors - settings for the JSHint are specified in ```.jshintrc```.
You can check for errors using ```grunt``` command which runs both jshint and mocha tests.
Please check for errors before opening any pull requests.

# Credits

* Written by Martin Zagora, <zaggino@gmail.com>
* Thanks to Oleksiy Krivoshey, <oleksiyk@gmail.com> for refactoring and new API (version 2.x) and bugfixing
