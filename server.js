var express = require('express');
var port = process.env.PORT || 3000;

var app = express();
var sites = {};
var counter = 1;

app.get('/new/:url', function(req, res) {
  if(!sites[req.params.url]) {
    sites[req.params.url] = counter++;
  }
  res.send({
    original_url: 'req.params.url',
    short_url: sites[req.params.url]
  })
});

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.listen(port, function() {
  console.log('listening on port ' + port);
});
