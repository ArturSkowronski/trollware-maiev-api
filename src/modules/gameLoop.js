
"use strict";

var targetGenerator = require("./targetGenerator");

var winston = require("winston");
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: "debug" })
  ]
});

var gameLoop;

gameLoop = function (gameSession) {
  var gameSessionID = gameSession.id;
  var generateTarget = targetGenerator.generate();

  return {
    start: function () {
      log.debug("GameLoop for game %s start", gameSessionID);
      return generateTarget.next().value;
    },
    next: function () {
      log.debug("GameLoop Next");
      return generateTarget.next().value;
    },
    stop: function () {
      log.debug("GameLoop Stop");
      return true;
    }
  };
};


exports.gameLoop = gameLoop;
