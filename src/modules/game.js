var log = require('winston');

// DEFINE EVENTS
var events = {}, Game, disconnected, connected, defineEvents, defineEventHandlers;

var createGame, joinGame;

Game = function (io) {
  if (!io) {
    throw new Error("Game need to be initialized with Socket Session");
  }
  defineEvents(io);
  log.info("Game Object Created");
  io.connection(connected, disconnected);
};

defineEvents = function(io) {
  events.TEST = io.defineEvent('test');
  events.CREATE_GAME = io.defineEvent('createGame');
  events.JOIN_GAME = io.defineEvent('joinGame');
}

defineEventHandlers = function(socket) {
  socket.on(events.CREATE_GAME, createGame);
  socket.on(events.JOIN_GAME, joinGame);
}

createGame = function (data) {
  log.info(data);
};

joinGame = function (data, socket) {
  log.info(data);
  socket.join(data.gameID);
};

connected = function (socket) {
  defineEventHandlers(socket);
  console.log("Game informed that player " + socket.id + " connected");
};

disconnected = function (socket) {
  console.log("Game informed that player " + socket.id + " disconnected");
};

module.exports = exports = Game;
