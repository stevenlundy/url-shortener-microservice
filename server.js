var express = require('express');
var db = require('./db');
var port = process.env.PORT || 3000;
var controllers = require('./controllers');

var app = express();
app.get('/new/*', controllers.addUrl);
app.get('/:short_id', controllers.redirectToUrl);

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
