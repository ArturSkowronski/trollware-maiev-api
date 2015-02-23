var winston = require('winston');
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'debug' }),
  ]
});

var gameLoop = function(gameSession){
	var gameSessionID = gameSession.id;
	
	return {
		start: function() {
		    log.debug("GameLoop Start");
			return true;
		},
		next: function() {
		    log.debug("GameLoop Next");
			return targerGenerator().next().value;
		},
		stop: function() {
		    log.debug("GameLoop Stop");
			return true;
		}
	}
}

var targetGenerator = function *() {
	while(true){
	    log.debug("GameLoop Event yielded");
        yield createTarget();
    }
};

createTarget = function(){

}

exports.gameLoop = gameLoop;