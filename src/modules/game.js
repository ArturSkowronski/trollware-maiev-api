var log = require('winston');

module.exports = exports = Game;

// DEFINE EVENTS
var events = {}

function Game(io){
	if(!io) throw new Error('Game need to be initialized with Socket Session');
	this.io = io;
	defineEvents(io);
	log.info("Game Object Created");
	this.io.on(events.CONNECTION, connection)

}

var connection = function(socket){
  console.log("Connected");
}

exports.startSession = function (socket) {

}

function defineEvents(io){
	events.CONNECTION = io.defineEvent('connection');
	events.TEST = io.defineEvent('test');
}
