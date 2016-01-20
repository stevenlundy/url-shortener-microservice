var express = require('express');
var db = require('./db');
var port = process.env.PORT || 3000;

var app = express();
var sites = {};
var short_ids = [];
var counter = 1;

app.get('/new/*', function(req, res) {
  var path = req.path;
  var allow = req.query.allow;
  var url = path.slice('/new/'.length);
  var urlPattern = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if(urlPattern.test(url) || allow){
    if(!sites[url]) {
      sites[url] = counter;
      short_ids[counter++] = url;
    }
    res.send({
      original_url: url,
      short_url: 'http://' + req.headers.host + '/' + sites[url]
    })
  } else {
    res.send({
      error: 'URL invalid'
    });
  }
});

app.get('/:short_id', function(req, res) {
  if(short_ids[req.params.short_id]) {
    res.send('redirecting to ' + short_ids[req.params.short_id]);
  } else {
    res.send({
      error: 'No short url found for given input'
    });
  }
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
