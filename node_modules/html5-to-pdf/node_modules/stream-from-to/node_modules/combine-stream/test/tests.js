var assert = require("chai").assert,
    sinon = require("sinon");

var stream = require("readable-stream");

var CombineStream = require("../");

describe("combine-stream", function() {
  it("should combine all output into one stream", function(done) {
    var s1 = new stream.Transform({objectMode: true}),
        s2 = new stream.Transform({objectMode: true});

    s1._transform = function _transform(input, encoding, done) {
      this.push(input + " 1");

      return done();
    };

    s2._transform = function _transform(input, encoding, done) {
      this.push(input + " 2");

      return done();
    };

    var combine = new CombineStream([s1, s2]);

    var expected = ["hello 1", "hello 2"];
        actual = [];

    combine.on("data", function(e) {
      actual.push(e);
    });

    combine.on("end", function() {
      assert.deepEqual(expected, actual);

      return done();
    });

    combine.write("hello");

    combine.end();
  });

  it("should end combined streams when it is ended", function(done) {
    var s1 = new stream.PassThrough(),
        s2 = new stream.PassThrough();

    var count = 0;
    var onEnd = function onEnd() {
      count++;

      if (count === 2) {
        return done();
      }
    };

    s1.on("end", onEnd);
    s2.on("end", onEnd);

    var combine = new CombineStream([s1, s2]);

    combine.end();
  });

  it("should pause combined streams when its write buffer fills up", function(done) {
    var s = new stream.PassThrough({objectMode: true});

    var spy = sinon.spy(s, "pause");

    var combine = new CombineStream({streams: [s], highWaterMark: 5});

    for (var i=0;i<25;++i) {
      combine.write({o: i});
    }

    setTimeout(function() {
      assert.isTrue(spy.called);

      return done();
    }, 10);
  });

  it("should end when all containing streams end", function(done) {
    var s1 = new stream.PassThrough(),
        s2 = new stream.PassThrough();

    var combine = new CombineStream([s1, s2]);

    combine.end(done);
  });
});
