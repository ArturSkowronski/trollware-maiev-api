var _ = require('lodash');
var log = require('winston');
var Q = require('q');

var gameArray = []

var createGameModel, 
	gameModel, 
	addPlayerToGameModel, 
	gameByGameID, 
	gameByPlayerID,
	indexOfGameByGameID,
	indexOfGameByPlayerID,
	playerByIDByGameID, 
	debugGameSession;

createGameModel = function(player){
	gameArray.push(gameModel(player))
}

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

gameLoop = function(player){
	return {
		start: function(){
			var gamePromise = Q.defer();
		    var gameSessionLoop = gameLoop.gameLoop(gameSession.gameByPlayerId(player.id));
		    setIntervalX(gameSessionLoop, 1000, 5, gamePromise)
		    gamePromise.promise.then(function(data){
		    log.info("We ended");
		  });
		}
	}	
}

var setIntervalX = function(gameSessionLoop, delay, repetitions, Q) {
  var x = 0;
  var intervalID = window.setInterval(function () {
     gameSessionLoop.next();
     if (++x === repetitions) {
         Q.resolve(gameSessionLoop.stop());
         window.clearInterval(intervalID);
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
exports.debugGameSession = debugGameSession