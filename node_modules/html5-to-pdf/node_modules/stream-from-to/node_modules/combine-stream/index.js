var stream = require("readable-stream");

var CombineStream = module.exports = function CombineStream(options) {
  options = options || {};

  if (Array.isArray(options)) {
    options = {streams: options};
  }

  options.objectMode = true;

  stream.Duplex.call(this, options);

  var self = this;

  // copy the streams array, or make an empty one
  this._streams = (options.streams || []);

  // need at least one stream
  if (this._streams.length === 0) {
    this._streams.push(new stream.PassThrough({objectMode: true}));
  }

  // default: true
  this._bubbleErrors = (typeof options.bubbleErrors === "undefined") || !!options.bubbleErrors;

  // error bubbling! yay!
  if (this._bubbleErrors) {
    for (var i=0;i<this._streams.length;++i) {
      this._streams[i].on("error", function(e) {
        return self.emit("error", e);
      });
    }
  }

  // poor man's .pipe()
  var awaitingEnd = this._streams.length;
  for (var i=0;i<this._streams.length;++i) {
    (function(s) {
      s.on("data", function(e) {
        if (!self.push(e)) {
          s.pause();
        }
      });

      s.once("end", function() {
        awaitingEnd--;

        if (awaitingEnd === 0) {
          self.push(null);
        }
      });
    })(this._streams[i]);
  }

  // propagate .end() action
  this.on("finish", function() {
    for (var i=0;i<self._streams.length;++i) {
      self._streams[i].end();
    }
  });
};
CombineStream.prototype = Object.create(stream.Duplex.prototype, {constructor: {value: CombineStream}});

CombineStream.prototype._write = function _write(input, encoding, done) {
  var waiting = this._streams.length;

  if (waiting === 0) {
    return done();
  }

  for (var i=0;i<this._streams.length;++i) {
    this._streams[i].write(input, encoding, function() {
      waiting--;

      if (waiting === 0) {
        return done();
      }
    });
  }
};

CombineStream.prototype._read = function _read(n) {
  for (var i=0;i<this._streams.length;++i) {
    this._streams[i].resume();
  }
};
