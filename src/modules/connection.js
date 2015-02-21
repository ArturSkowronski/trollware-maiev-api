var socketio = require('socket.io');
var events = require('./events');
var socketWrapper = require('./socket');
var log = require('winston');

var io = {}

exports.initialize = function (app){
  io = socketio(app);	
  log.info("Socket.io Initialized");
  return this;
}

exports.io = io;
exports.defineEvent = function (eventName) {
  return events.defineEvent(eventName);
}

exports.connection = function (connected, disconnected) {
  io.on('connection',function(socket){
    log.info("Client connected with socket id: %s", socket.id);
		
    var socketWrapper = {id: socket.id};

	socketWrapper.emit = function(symbol, data) {
		events.validateSymbol(symbol);
		socket.emit(Symbol.keyFor(symbol), data);
	};

	socketWrapper.on = function (symbol, callback) {
		events.validateSymbol(symbol);
		socket.on(Symbol.keyFor(symbol), function(data){ callback(data, socket) });
	};

	connected(socketWrapper);	
	
	socket.on('disconnect', function () {
		disconnected(socket);
		log.info("Client left with socket id: %s", socket.id);
  	});
  })
}