var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

var io = require('./src/modules/connection')
io.initialize(server);

var game = require('./src/modules/game')(io)

app.set('port', (process.env.PORT || 5000));
app.use('/public', express.static(__dirname + '/public'));


server.listen(app.get('port'), function() {console.log("Node app is running at localhost:" + app.get('port'));});
app.get('/', function(request, response) {response.send('Hello World! Test Buildu #2');});
app.get('/socket', function (req, res) {res.sendFile(__dirname + '/index.html');});
