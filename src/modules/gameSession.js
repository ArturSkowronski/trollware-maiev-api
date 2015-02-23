var _ = require('lodash');
var log = require('winston');
var Q = require('q');
var gameLoopObject = require('./gameLoop');

var gameArray = []

var createGameModel, 
	gameModel, 
	addPlayerToGameModel, 
	gameByGameID, 
	gameByPlayerID,
	indexOfGameByGameID,
	indexOfGameByPlayerID,
	playerByIDByGameID, 
	debugGameSession,
	targetShot, 
	resultOfGame;

createGameModel = function(player){
	gameArray.push(gameModel(player))
}

///TODO Clojure IT
gameModel = function (player) {
	return {
		id: player.id,
		players: [player.id],
		scores: []
	}
}

gameByGameID = function (gameID) {
    return _.findWhere(gameArray, {id: gameID})
}

gameByPlayerID = function (playerID) {
    return _.find(gameArray, function(item){
    	return _.includes(item.players, playerID)
    });
}

indexOfGameByGameID = function(gameID){
	return _.indexOf(gameArray, gameByGameID(gameID));
}

indexOfGameByPlayerID = function(playerID){
	return _.indexOf(gameArray, gameByPlayerID(playerID));
}

playerByIDByGameID = function (id, game_id) {
	return _.find(gameByGameID(game_id).players, function(item){
		return item == id
	});
}

targetShot = function(playerID) {
	var shotTarget = gameByPlayerID(playerID).target;
	var score = {
		score: shotTarget.score,
		type: shotTarget.type,
		playerID: playerID
	}
	addScoreToGame(score)
}

addScoreToGame = function(score) {
	gameByPlayerID(playerID).score.push(score);
}

resultOfGame = function(playerID, score) {
	return _.chain(gameByPlayerID(playerID).score)
	 .map(function (item) { return item.score;})
	 .reduce(function(sum,item){
	 	return sum + item;
	 }).value();
}

///TODO Generator? Promise?
gameLoop = function(playerID){
	return {
		start: function(){
			var gamePromise = Q.defer();
		    var gameSessionLoop = gameLoopObject.gameLoop(gameByPlayerID(playerID));
		    gameSessionLoop.start();
		    gameLoopRounds(gameSessionLoop, 5000, 5, gamePromise, gameByPlayerID(playerID))
		    gamePromise.promise.then(function(data){
		    	log.info("We ended");
		  });
		}
	}	
}

var gameLoopRounds = function(gameSessionLoop, delay, repetitions, Q, gameSessionObject) {
  var x = 0;
  var intervalID = setInterval(function () {
     gameSessionObject.target = gameSessionLoop.next();
     if (++x === repetitions) {
     	 gameSessionObject.target = undefined;
         Q.resolve(gameSessionLoop.stop());
         clearInterval(intervalID);
     }
  }, delay);
};

addPlayerToGame = function (playerID, gameID) {
	gameArray[indexOfGameByGameID(gameID)].players.push(playerID)
}

removePlayerById = function (playerID) {
	_.forEach(gameArray, function(game){
		_.remove(game.players, function(player) {
	  		if(player == playerID) {
	  			log.info("Player " + playerID + " removed from game " + game.id);
				return true;
	  		} else {
				return false;
			}
		})
	})
}

debugGameSession = function(){
	return gameArray;
}

exports.createGameModel = createGameModel
exports.gameByGameID = gameByGameID
exports.playerByIDByGameID = playerByIDByGameID
exports.addPlayerToGameModel = addPlayerToGameModel
exports.removePlayerById = removePlayerById
exports.debugGameSession = debugGameSession
exports.gameLoop = gameLoop
exports.targetShot = targetShot
exports.debugGameSession = debugGameSession