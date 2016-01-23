var express = require('express');

var app = express();

// serve static files
app.use(express.static(__dirname + '/../client'));

// all requests routed in middleware.js
require('./config/middleware.js')(app, express);

// serve favicon
// app.use(favicon(__dirname + '/../client/assets/favicon.ico'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening on port: ' + port);
});

module.exports = app;
