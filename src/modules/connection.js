var socketio = require('socket.io');
var events = require('./events');
var log = require('winston');

var connection ={}

exports.initialize = function (app) {
	connection = socketio(app);	
	log.info("Socket.io Initialized");
}

exports.createNamespace = function (app) {
	connection = socketio(app);	
	connection.on('connection', connection)
}

exports.emit = function (symbol, data) {
	events.validateSymbol(symbol);
	connection.emit('connection', connection);
}

exports.defineEvent = function (eventName) {
	return events.defineEvent(eventName);
}

exports.on = function (symbol, callback) {
	events.validateSymbol(symbol);
	log.info("Emmit Event '%s'", Symbol.keyFor(symbol));
	connection.on(Symbol.keyFor(symbol), callback)
}