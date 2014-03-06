var automatic = require('./lib/automatic').createClient('CLIENT_ID', 'CLIENT_SECRET');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.redirect(automatic.authorizeUrl(['scope:trip:summary'], 'SecretStateString'));  
});

app.get('/redirect-url', function(req, res) {
  try {
    automatic.validateAuthorization(req.query.code, 'SecretStateString');
    automatic.requestToken(function(error, response, body) {
      res.redirect('/dump-trips');
    });
  } catch(err) {
    res.send('Go directly to jail. Do not pass go. Do not collect $200.');
  }
});

app.get('/dump-trips', function(req, res) {
  automatic.trips(function(error, response, body){
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

app.listen(3000);
