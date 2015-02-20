var socketio = require('socket.io');

var connection = function(){
  console.log("Connected");
}
 
exports.initialize = function (app) {
	io = socketio(app);	
	io.on('connection', connection)
}