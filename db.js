var mongo = require('mongodb').MongoClient;

var state = {
  db: null
};

module.exports.connect = function(url, done) {
  if (state.db) return done();

  mongo.connect(url, function(err, db) {
    if (err) return done(err);
    state.db = db;
    done();
  });
};

module.exports.get = function() {
  return state.db;
};

module.exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null;
      done(err);
    });
  }
};
