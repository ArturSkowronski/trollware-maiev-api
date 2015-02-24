var socketio = require('socket.io');
var events = require('./events');
var winston = require('winston');
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

var io = {};

var connection,
  initialize,
  defineEvent;

initialize = function (app) {
  io = socketio(app);
  log.info("Socket.io Initialized");
  return this;
};

defineEvent = function (eventName) {
  return events.defineEvent(eventName);
};

connection = function (connected, disconnected) {
  io.on('connection', function (socket) {
    log.debug("Client connected with socket id: %s", socket.id);
    var socketWrapper = {id: socket.id, _socket: socket};

    socketWrapper.join = function (room) {
      log.debug("Client %s joined to room %s", socket.id, room);
      socket.join(room);
    };

    socketWrapper.emit = function (symbol, data) {
      events.validateSymbol(symbol);
      log.debug("Emmiting event " + Symbol.keyFor(symbol) + " to " + socket.id);
      socket.emit(Symbol.keyFor(symbol), data);
    };

    socketWrapper.on = function (symbol, callback) {
      log.debug("Player %s Listening on event %s", socket.id, Symbol.keyFor(symbol));
      events.validateSymbol(symbol);
      socket.on(Symbol.keyFor(symbol), function (data) { callback(data, socketWrapper); });
    };

    connected(socketWrapper);

    socket.on('disconnect', function () {
      disconnected(socket);
      log.debug("Client left with socket id: %s", socket.id);
    });
  });
};

exports.io = io;
exports.connection = connection;
exports.defineEvent = defineEvent;
exports.initialize = initialize;