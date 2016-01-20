var db = require('./db');
var mongo = require('mongodb');

module.exports.getId = function(url) {
  var collection = db.get().collection('urls');
  return new Promise(function (resolve, reject) {
    collection.find({ url: url }).toArray(function(err, results) {
      if(err) {
        reject(err);
      } else if(results.length) {
        resolve(results[0]._id);
      } else {
        resolve(module.exports.addUrl(url));
      }
    });
  });
};

module.exports.addUrl = function(url) {
  var collection = db.get().collection('urls');
  return new Promise(function (resolve, reject) {
    collection.insert({ url: url }, function(err, result) {
      if(err) {
        reject(err);
      } else {
        resolve(result.insertedIds[0]);
      }
    });
  });
};

module.exports.getUrl = function(id) {
  var collection = db.get().collection('urls');
  return new Promise(function (resolve, reject) {
    collection.find({ _id: mongo.ObjectId(id) }).toArray(function(err, results) {
      if(err) {
        reject(err);
      } else if(results.length) {
        resolve(results[0].url);
      } else {
        resolve();
      }
    });
  });
}
