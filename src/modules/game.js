var log = require('winston');
var _ = require('lodash');

// DEFINE EVENTS
var events = {}, Game, disconnected, connected, defineEvents, defineEventHandlers, createGameModel;

var createGame, joinGame;

var gameArray = []

Game = function (io) {
  if (!io) {
  	log.error("Game need to be initialized with Socket Session");
  }
  defineEvents(io);
  log.info("Game Object Created");
  io.connection(connected, disconnected);
};

defineEvents = function(io) {
  events.TEST = io.defineEvent('test');
  events.CREATE_GAME = io.defineEvent('createGame');
  events.GAME_CREATED = io.defineEvent('gameCreated');
  events.GAME_NOT_CREATED = io.defineEvent('gameNotCreated');
  events.JOIN_GAME = io.defineEvent('joinGame');
}

defineEventHandlers = function(socket) {
  socket.on(events.CREATE_GAME, createGame);
  socket.on(events.JOIN_GAME, joinGame);
}

createGame = function (data, socket) {
  if(findGameById(socket.id)) {
    log.error("Game " + socket.id + " already created");
    socket.emit(events.GAME_NOT_CREATED, {error: "Already exists"})
  } else {
    log.info("Game created with gameId: " + socket.id);
    gameArray.push(createGameModel(socket))
    socket.emit(events.GAME_CREATED, {gameId: socket.id})
  }
};

joinGame = function (data, socket) {

  if(!data.gameID) {
  	log.error("Didn't sent game ID");
    socket.emit(events.GAME_NOT_CREATED, {error: "Didn't sent game ID"})
    return;
  } 

  if(!findGameById(data.gameID)) {
    log.error("Game " + data.gameID + " not exists");
    socket.emit(events.GAME_NOT_CREATED, {error: "Game not exists"})
    return;
  }

  if(findPlayerByIdByGame(socket.id, data.gameID)) {
    log.error("Already joined");
    socket.emit(events.GAME_NOT_CREATED, {error: "Already joined"})
    return;
  }

  socket.join(data.gameID);
  log.info("Player %s joined game %s", socket.id, data.gameID);

};

createGameModel = function (socket) {
	return {
		id: socket.id,
		players: [socket.id]
	}
}

findGameById = function (id) {
	return _.findWhere(gameArray, {id: id})
}

findPlayerByIdByGame = function (id, game_id) {
	return _.findWhere(findGameById(game_id).players, {id: id});
}


connected = function (socket) {
  defineEventHandlers(socket);
};

disconnected = function (socket) {
};

module.exports = exports = Game;
