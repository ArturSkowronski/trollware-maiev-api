"use strict";

var _ = require("lodash");
var log = require("winston");
var Q = require("q");
var gameLoopObject = require("./gameLoop");

var gameArray = [];

var createGameModel,
  gameModel,
  addPlayerToGame,
  addScoreToGame,
  gameByGameID,
  gameByPlayerID,
  removePlayerById,
  indexOfGameByGameID,
  indexOfGameByPlayerID,
  playerByIDByGameID,
  debugGameSession,
  targetShot,
  gameLoop,
  resultOfGame,
  gameLoopRounds;

/**
 * Creating game and adding it's creator to it
 *
 * @param {string} player - player which create game.
 */
createGameModel = function (player) {
  gameArray.push(gameModel(player));
};

///TODO Clojure IT
/**
 * Game model object creator function
 *
 * @param {string} player - player which create game.
 */
gameModel = function (player) {
  return {
    id: player.id,
    players: [player.id],
    scores: []
  };
};

/**
 * Query Game by Game ID
 *
 * @param {string} gameID - ID of game we want to select.
 */
gameByGameID = function (gameID) {
  return _.findWhere(gameArray, {id: gameID});
};

/**
 * Query Game by Player ID. Player can be only in one game at time.
 *
 * @param {string} playerID - ID of game we want to select.
 */
gameByPlayerID = function (playerID) {
  return _.findWhere(gameArray, function (item) {
    return _.includes(item.players, playerID);
  });
};

/**
 * Query Index of Game by Game ID.
 *
 * @param {string} gameID - ID of game we want to select index for.
 */
indexOfGameByGameID = function (gameID) {
  return _.indexOf(gameArray, gameByGameID(gameID));
};

/**
 * Query Index of Game by Player ID. Player can be only in one game at time.
 *
 * @param {string} playerID - ID of player we want to select game index for.
 */
indexOfGameByPlayerID = function (playerID) {
  return _.indexOf(gameArray, gameByPlayerID(playerID));
};

/**
 * DEPRECATED
 * Query player by it's ID and by Game ID. To Rewrite due to fact that player
 * can be only in one game at time so Game ID is obsolete
 *
 * @param {string} playerID - ID of player we want to select.
 * @param {string} gameID - ID of game we want to select player for.
 */
playerByIDByGameID = function (id, gameID) {
  return _.findWhere(gameByGameID(gameID).players, function (item) {
    return item === id;
  });
};

/**
 * Action executed after shooting target. Retrieve information about current
 * target and pass it to the final score. Score has information about which
 * player got it.
 *
 * @param {string} playerID - ID of player who shoot.
 */
targetShot = function (playerID) {
  var shotTarget = gameByPlayerID(playerID).target;
  var score = {
    score: shotTarget.score,
    type: shotTarget.type,
    playerID: playerID
  };
  addScoreToGame(playerID, score);
};

/**
 * Adding score to the score model in game session.
 *
 * @param {object} score - Score object passed to be preserved.
 */
addScoreToGame = function (playerID, score) {
  gameByPlayerID(playerID).score.push(score);
};

/**
 * Function evealuating final result of game.
 *
 * @param {string} playerID - ID Identyfing the specific game (should be
 * rewritten, game should be resolverd different way)
 */
resultOfGame = function (playerID) {
  return _.chain(gameByPlayerID(playerID).score)
    .map(function (item) { return item.score; })
    .reduce(function (sum, item) { return sum + item; })
    .value();
};

/**
 * Main Game loop. Has method start which start a entertainment. Game
 * is started a Interval which will be rerun given amount of time. New
 * Targets are genereated by Target Generator from Game Loop Module.
 * After all rerun, information about game are send through the promise.
 *
 * @param {string} playerID - ID Identyfing the specific game (should be
 * rewritten, game should be resolverd different way)
 */
///TODO How to propagate teaser to client ?
///Generator? Promise? Listener/Subscriber?
gameLoop = function (playerID) {
  return {
    start: function () {
      var gamePromise = Q.defer();
      var gameSessionLoop = gameLoopObject.gameLoop(gameByPlayerID(playerID));
      gameSessionLoop.start();
      gameLoopRounds(gameSessionLoop, 5000, 5, gamePromise, gameByPlayerID(playerID));
      gamePromise.promise.then(function () {
        log.info("We ended");
      });
    }
  };
};

/**
 * Function generating game loop rounds with given interval. Each
 * round gets it's own target which is passed to the clients.
 * Targets are genereated by Target Generator from Game Loop Module.
 * After all rerun, information about game are send through resolving the
 * passed promise and interval is cleaned.
 *
 * @param {object} gameSessionLoop - Game Session module initialized by
 * Game Session.
 * @param {int} delay - Delay between sessions
 * @param {int} repetitions - Amount of repetitions
 * @param {promies} promise - promised object to be resolved
 * @param {object} gameSessionObject - session object where new target is
 * passed
 */
gameLoopRounds = function (gameSessionLoop, delay, repetitions, promise, gameSessionObject) {
  var x = 0;
  var intervalID = setInterval(function () {
    gameSessionObject.target = gameSessionLoop.next();
    if (++x === repetitions) {
      gameSessionObject.target = undefined;
      promise.resolve(gameSessionLoop.stop());
      clearInterval(intervalID);
    }
  }, delay);
};

/**
 * Adding player to game
 *
 * @param {string} playerID - Player which is added to game.
 * @param {string} gameID - Game to which we want to add player.
 */
addPlayerToGame = function (playerID, gameID) {
  gameArray[indexOfGameByGameID(gameID)].players.push(playerID);
};

/**
 * Remove player from games. Player can be only in one game at time.
 *
 * @param {string} playerID - Player which is removed from game.
 */
removePlayerById = function (playerID) {
  _.forEach(gameArray, function (game) {
    _.remove(game.players, function (player) {
      if (player === playerID) {
        log.info("Player " + playerID + " removed from game " + game.id);
        return true;
      }
      return false;
    });
  });
};

/**
 * Debut method informing about current state of game
 */
debugGameSession = function () {
  return gameArray;
};

exports.createGameModel = createGameModel;
exports.gameByGameID = gameByGameID;
exports.gameByPlayerID = gameByPlayerID;
exports.playerByIDByGameID = playerByIDByGameID;
exports.addPlayerToGame = addPlayerToGame;
exports.removePlayerById = removePlayerById;
exports.debugGameSession = debugGameSession;
exports.indexOfGameByGameID = indexOfGameByGameID;
exports.indexOfGameByPlayerID = indexOfGameByPlayerID;
exports.gameLoop = gameLoop;
exports.targetShot = targetShot;