var models = require('./models');

module.exports.addUrl = function(req, res) {
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
};

module.exports.redirectToUrl = function(req, res) {
  models.getUrl(req.params.short_id).then(function(url) {
    if(url) {
      res.send({
        original_url: url,
      });
    } else {
      res.send({
        error: 'No short url found for given input'
      });
    }
  }).catch(function(err) {
    res.send(err);
  });
};
