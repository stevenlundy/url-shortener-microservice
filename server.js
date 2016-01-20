var express = require('express');
var port = process.env.PORT || 3000;

var app = express();
var sites = {};
var short_ids = [];
var counter = 1;

app.get('/new/:url', function(req, res) {
  if(!sites[req.params.url]) {
    sites[req.params.url] = counter;
    short_ids[counter++] = req.params.url;
  }
  res.send({
    original_url: 'req.params.url',
    short_url: sites[req.params.url]
  })
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

app.listen(port, function() {
  console.log('listening on port ' + port);
});
