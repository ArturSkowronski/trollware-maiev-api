var _ = require('lodash');
var log = require('winston');

var gameArray = []

var createGameModel, gameModel, addPlayerToGameModel, findGameById, findPlayerByIdByGame, debugGameSession;

createGameModel = function(socket){
	gameArray.push(gameModel(socket))
}

gameModel = function (socket) {
	return {
		id: socket.id,
		players: [socket.id]
	}
}

addPlayerToGameModel = function (socket, gameID) {
	var indexOfGame = _.indexOf(gameArray, findGameById(gameID));
	gameArray[indexOfGame].players.push(socket)
}

findGameById = function (id) {
	return _.findWhere(gameArray, {id: id})
}

findPlayerByIdByGame = function (id, game_id) {
	return _.filter(findGameById(game_id).players, function(item){return item == id}).length;
}

removePlayerById = function (id) {
	_.forEach(gameArray, function(game){
		_.remove(game.players, function(player) {
	  		if(player == id) {
	  			log.info("Player " + id + " removed from game " + game.id);
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
exports.findGameById = findGameById
exports.findPlayerByIdByGame = findPlayerByIdByGame
exports.addPlayerToGameModel = addPlayerToGameModel
exports.removePlayerById = removePlayerById
exports.debugGameSession = debugGameSession