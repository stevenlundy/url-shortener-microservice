var db = require('./db');

function getNextSequence(name) {
  var collection = db.get().collection('counters');
  return new Promise(function(resolve, reject) {
    collection.findAndModify(
      { '_id': name },
      [],
      { '$inc': { seq: 1 } },
      { upsert: true, new: true },
      function(err, result) {
        if(err) {
          reject(err);
        } else {
          resolve(result.value.seq);
        }
      }
    );
  });
}

module.exports.getId = function(url) {
  var collection = db.get().collection('urls');
  return new Promise(function (resolve, reject) {
    getNextSequence('test2').then(function(seq) {
      console.log(seq);
    }).catch(function(err) {
      console.log(err);
    });
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
  return getNextSequence('urls').then(function(id) {
    return new Promise(function (resolve, reject) {
      collection.insert({ _id: id, url: url }, function(err, result) {
        if(err) {
          reject(err);
        } else {
          resolve(id);
        }
      });
    });
  });
};

module.exports.getUrl = function(id) {
  var collection = db.get().collection('urls');
  return new Promise(function (resolve, reject) {
    collection.find({ _id: id }).toArray(function(err, results) {
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
