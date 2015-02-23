var winston = require('winston');
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

var targetGenerator, gameLoop, createTarget, randomizeTarget;

gameLoop = function(gameSession){
	var gameSessionID = gameSession.id;
	var generateTarget = targetGenerator();

	return {
		start: function() {
		    log.debug("GameLoop Start");
			return generateTarget.next().value;
		},
		next: function() {
		    log.debug("GameLoop Next");
			return generateTarget.next().value;
		},
		stop: function() {
		    log.debug("GameLoop Stop");
			return true;
		}
	}
}

targetGenerator = function *() {
	while(true){
	    log.debug("GameLoop Event yielded");
        yield createTarget();
    }
};

createTarget = function(){
    log.debug("Target Created");
    return randomizeTarget();
}

randomizeTarget = function(){
	//TODO Symbolize IT
	var typeOfItems = {};
	typeOfItems.good = "good";
	typeOfItems.bad = "bad";
	
	return {
		type: typeOfItems.good,
		score: 1
	}
}



exports.gameLoop = gameLoop;