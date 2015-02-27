"use strict";

var _ = require("lodash");
var Q = require("q");
var winston = require("winston");
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: "debug" })
  ]
});

var gameLoopObject = require("./gameLoop");

var gameArray = [];

var createGameModel,
  gameModel,
  gameByGameID,
  gameByPlayerID,
  removePlayerById,
  indexOfGameByGameID,
  indexOfGameByPlayerID,
  playerByIDByGameID,
  debugGameSession,
  gameLoop,
  gameLoopRounds;

/**
 * Creating game and adding it's creator to it
 *
 * @param {string} player - player which create game.
 */
createGameModel = (player) => {
  gameArray.push(new gameModel(player));
};

///TODO Clojure IT
/**
 * Game model object creator function
 *
 * @param {string} player - player which create game.
 */
gameModel = function (player) {
  var id = player.id;
  var players = [player.id];
  var scores = [];
  var target = {};
  var addScoreToGame = function(score) {
    scores.push(score);
  };
  return {
    id: id,
    scores: scores,
    players: players,
    target: target,
    targetShot: function () {
      addScoreToGame(this.target);
    },
    addPlayerToGame: function (playerID) {
      this.players.push(playerID);
    },
    addTarget: function (target) {
      this.target = target;
    },
    clearTarget: function () {
      this.target = undefined;
    },
    resultOfGame: function () {
      return _.chain(this.scores)
        .map(function (item) { return item.score;})
        .reduce(function (sum, item) { return sum + item; })
        .value();
    }
  }
};

/**
 * Query Game by Game ID
 *
 * @param {string} gameID - ID of game we want to select.
 */
gameByGameID = (gameID) => {
  return gameArray[indexOfGameByGameID(gameID)];
};

/**
 * Query Game by Player ID. Player can be only in one game at time.
 *
 * @param {string} playerID - ID of game we want to select.
 */
gameByPlayerID = (playerID) => {
    return gameArray[indexOfGameByPlayerID(playerID)]; 
};

/**
 * Query Index of Game by Game ID.
 *
 * @param {string} gameID - ID of game we want to select index for.
 */
indexOfGameByGameID = (gameID) => {
  return _.indexOf(gameArray, _.find(gameArray, (item) => {
    return item.id === gameID;
  }));
};

/**
 * Query Index of Game by Player ID. Player can be only in one game at time.
 *
 * @param {string} playerID - ID of player we want to select game index for.
 */
indexOfGameByPlayerID = (playerID) => {
  return _.indexOf(gameArray, _.find(gameArray, (item) => {
    return _.includes(item.players, playerID);
  }));
};

/**
 * DEPRECATED
 * Query player by it's ID and by Game ID. To Rewrite due to fact that player
 * can be only in one game at time so Game ID is obsolete
 *
 * @param {string} playerID - ID of player we want to select.
 * @param {string} gameID - ID of game we want to select player for.
 */
playerByIDByGameID = (id, gameID) => {
  return _.find(gameByGameID(gameID).players, function (item) {
    return item === id;
  });
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
gameLoop = (playerID, targetEvent, endEvent) => {
  return {
    start: () => {
      var gamePromise = Q.defer();
      var selectedGame = gameByPlayerID(playerID);
      var gameSessionLoop = gameLoopObject.gameLoop(selectedGame);
      var target = gameSessionLoop.start();
      selectedGame.addTarget(target);
      targetEvent(selectedGame.target);
      
      log.debug("Received Target of Type: " + selectedGame.target.type);
      
      gameLoopRounds(gameSessionLoop, 5000, 5, gamePromise, selectedGame, targetEvent);
      
      gamePromise.promise.then(() => {
        endEvent(selectedGame.resultOfGame());
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
 * @param {funct} targetEvent - function emitin new target to clients
 */
gameLoopRounds = (gameSessionLoop, delay, repetitions, promise, gameSessionObject, targetEvent) => {
  var x = 0;
  var intervalID = setInterval(() => {
    var target = gameSessionLoop.next();
    log.debug("Received Target of Type: " + target.type);
    gameSessionObject.addTarget(target);
    
    targetEvent(target);

    if (++x === repetitions) {
      gameSessionObject.clearTarget();
      promise.resolve(gameSessionLoop.stop());
      clearInterval(intervalID);
    }
  }, delay);
};

/**
 * Remove player from games. Player can be only in one game at time.
 *
 * @param {string} playerID - Player which is removed from game.
 */
removePlayerById = (playerID) => {
  _.forEach(gameArray, (game) => {
    _.remove(game.players, (player) => {
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
debugGameSession = () => {
  return gameArray;
};

exports.createGameModel = createGameModel;
exports.gameByGameID = gameByGameID;
exports.gameByPlayerID = gameByPlayerID;
exports.playerByIDByGameID = playerByIDByGameID;
exports.removePlayerById = removePlayerById;
exports.debugGameSession = debugGameSession;
exports.indexOfGameByGameID = indexOfGameByGameID;
exports.indexOfGameByPlayerID = indexOfGameByPlayerID;
exports.gameLoop = gameLoop;
exports.gameArray = gameArray;
