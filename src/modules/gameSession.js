var _ = require('lodash');

var gameArray = []

var createGameModel, gameModel, addPlayerToGameModel, findGameById, findPlayerByIdByGame;

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
	findGameById(socket.id, data.gameID).players.push(socket.id)
}

findGameById = function (id) {
	return _.findWhere(gameArray, {id: id})
}

findPlayerByIdByGame = function (id, game_id) {
	return _.findWhere(findGameById(game_id).players, {id: id});
}

exports.createGameModel = createGameModel
exports.findGameById = findGameById
exports.findPlayerByIdByGame = findPlayerByIdByGame
exports.addPlayerToGameModel = addPlayerToGameModel


