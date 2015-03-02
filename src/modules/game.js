"use strict";

var winston = require("winston");
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: "debug" })
  ]
});

var gameSession = require("./gameSession");

// DEFINE EVENTS
var events = {},
  disconnected,
  connected,
  defineEvents,
  defineEventHandlers,
  init,
  targetCreated,
  gameEnded,
  startGame,
  eventPusher,
  targetShot;

var createGame, joinGame;

init = (io) => {
  if (!io) {
    log.error("Game need to be initialized with Socket Session");
    return false;
  }
  defineEvents(io);
  log.info("Game Object Created");
  io.connection(connected, disconnected);
};

defineEvents = (io) => {
  
  //Event Listeners
  events.CREATE_GAME = io.defineEvent("createGame");
  events.START_GAME = io.defineEvent("startGame");
  events.JOIN_GAME = io.defineEvent("joinGame");
  events.TARGET_SHOT = io.defineEvent("targetShot");

  //Event Emitters
  events.GAME_CREATED = io.defineEvent("gameCreated");
  events.GAME_JOINED = io.defineEvent("gameJoined");
  events.TARGET_CREATED = io.defineEvent("targetCreated");
  events.GAME_ENDED = io.defineEvent("gameEnded");
  
  //Error Handling Event Emitters
  events.GAME_NOT_JOINED = io.defineEvent("gameNotJoined");
  events.GAME_NOT_CREATED = io.defineEvent("gameNotCreated");

};

defineEventHandlers = (socket) => {
  socket.on(events.CREATE_GAME, createGame);
  socket.on(events.START_GAME, startGame);
  socket.on(events.JOIN_GAME, joinGame);
  socket.on(events.TARGET_SHOT, targetShot);
};

createGame = (data, socket) => {
  if (gameSession.gameByGameID(socket.id)) {
    log.error("Game " + socket.id + " already created");
    socket.emit(events.GAME_NOT_CREATED, {error: "Already exists"});
  } else {
    log.info("Game created with gameId: " + socket.id);
    gameSession.createGameModel(socket);
    socket.emit(events.GAME_CREATED, {gameID: socket.id});
  }
};

joinGame = (data, socket) => {

  if (!data || !data.gameID) {
    log.error("Didn't sent game ID");
    socket.emit(events.GAME_NOT_JOINED, {error: "Didn't sent game ID"});
    return false;
  }

  if (!gameSession.gameByGameID(data.gameID)) {
    log.error("Game " + data.gameID + " not exists");
    socket.emit(events.GAME_NOT_JOINED, {error: "Game not exists"});
    return false;
  }

  if (gameSession.playerByIDByGameID(socket.id, data.gameID)) {
    log.error("Already joined");
    socket.emit(events.GAME_NOT_JOINED, {error: "Already joined"});
    return false;
  }

  socket.join(data.gameID);
  socket.emit(events.GAME_JOINED, {});
  gameSession.gameByPlayerID(data.gameID).addPlayerToGame(socket.id);
  log.info("Player %s joined game %s", socket.id, data.gameID);
};

targetShot = (data, socket) => gameSession.gameByPlayerID(socket).targetShot();
gameEnded = (socket, data) => socket.emit(events.GAME_ENDED, data);
targetCreated = (socket, data) => socket.emit(events.TARGET_CREATED);

eventPusher = (socket, funct) => {
  return (data) => {
      funct(socket, data);
    }
};

startGame = (data, socket) => {
  gameSession.gameLoop(socket.id, 
    eventPusher(socket, gameEnded), 
    eventPusher(socket, targetCreated)).start();
};

connected = (socket) => defineEventHandlers(socket);
disconnected = (socket) => gameSession.removePlayerById(socket.id);

exports.debug = gameSession.debugGameSession;
exports.init = init;

exports.createGame = createGame;
exports.joinGame = joinGame;

