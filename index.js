var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('./src/modules/connection');
var game = require('./src/modules/game')

game.start(io.initialize(server))

app.set('port', (process.env.PORT || 5000));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {res.sendFile(__dirname + '/index.html');});
app.get('/socket-local', function (req, res) {res.sendFile(__dirname + '/socket-local.html');});
app.get('/socket-server', function (req, res) {res.sendFile(__dirname + '/socket-server.html');});
app.get('/debug', function (req, res) {res.send(JSON.stringify(game.debug()));});

server.listen(app.get('port'), function() {console.log("Node app is running at localhost:" + app.get('port'));});
