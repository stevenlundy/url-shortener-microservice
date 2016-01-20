var express = require('express');
var db = require('./db');
var port = process.env.PORT || 3000;
var mongo = require('mongodb');
var models = require('./models');

var app = express();

app.get('/new/*', function(req, res) {
  var path = req.path;
  var allow = req.query.allow;
  var url = path.slice('/new/'.length);
  var urlPattern = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if(urlPattern.test(url) || allow){
    models.getId(url).then(function(id) {
      res.send({
        original_url: url,
        short_url: 'http://' + req.headers.host + '/' + id
      });
    }).catch(function(err) {
      res.send(err);
    });
  } else {
    res.send({
      error: 'URL invalid'
    });
  }
});

app.get('/:short_id', function(req, res) {
  var collection = db.get().collection('urls');
  collection.find({ _id: mongo.ObjectId(req.params.short_id) }).toArray(function(err, results) {
    if(err) {
      res.send(err);
    } else {
      if(results.length) {
        res.send({
          original_url: results[0].url,
        });
      } else {
        res.send({
          results: results,
          id: req.params.short_id,
          error: 'No short url found for given input'
        });
      }
    }
  });
});

db.connect('mongodb://localhost:27017/url-shortener', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  } else {
    app.listen(port, function() {
      console.log('listening on port ' + port);
    });
  }
});
