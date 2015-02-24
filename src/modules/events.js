"use strict";

var defineEvent,
  validateSymbol;

defineEvent = function (eventName) {
  return Symbol.for(eventName);
};

validateSymbol = function (symbol) {
  if(typeof symbol !== "symbol") {
    throw new Error('Not a symbol passed to emit function, cannot send');
  }
};

exports.defineEvent = defineEvent;
exports.validateSymbol = validateSymbol;
