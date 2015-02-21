module.exports = exports = Events;

exports.defineEvent = function (eventName) {
	return Symbol.for(eventName);
}

exports.validateSymbol = function (symbol) {
	if(typeof symbol != "symbol") {
		throw new Error('Not a symbol passed to emit function, cannot send');
	}
}

function Events(){}