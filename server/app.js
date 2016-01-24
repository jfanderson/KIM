var express = require('express');
var path = require('path');

var app = express();

// serve static files
app.use(express.static(__dirname + '/../client'));

// all requests routed in middleware.js
require('./config/middleware.js')(app, express);

// Serve index for all other requests
// This accomodates createBrowserHistory for client-side routing
app.get('*', function (req, res){
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

// serve favicon
// app.use(favicon(__dirname + '/../client/assets/favicon.ico'));

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening on port: ' + port);
});

module.exports = app;
