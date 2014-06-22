#!/usr/bin/env node

var stream = require("stream");

var CombineStream = require("./");

var delayed = function delayed(n) {
  var s = new stream.Transform({objectMode: true});

  s._transform = function _transform(input, encoding, done) {
    var self = this;

    return setTimeout(function() {
      self.push(input + " " + n);

      return done();
    }, n);
  };

  s._flush = function _flush(done) {
    console.log("ending!", n);

    setTimeout(done, n);
  };

  return s;
};

var streamA = delayed(100),
    streamB = delayed(500);

var combine = new CombineStream([streamA, streamB]);

combine.on("data", console.log);
combine.on("error", console.log);

combine.write("hello 1");
combine.write("hello 2");
combine.write("hello 3");

combine.end(function() {
  console.log("everything finished");
});
