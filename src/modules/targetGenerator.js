/*eslint-disable no-constant-condition*/

"use strict";

var winston = require("winston");
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: "debug" })
  ]
});

var createTarget,
  randomizeTarget;

var generate = function *() {
  while (true) {
    log.debug("GameLoop Event yielded");
    yield createTarget();
  }
};

createTarget = function () {
  log.debug("Target Created");
  return randomizeTarget();
};

randomizeTarget = function () {
  //TODO Symbolize IT
  var typeOfItems = {};
  typeOfItems.good = "good";
  typeOfItems.bad = "bad";

  return {
    type: typeOfItems.good,
    score: 1
  };
};

exports.generate = generate;
exports.test = 5;
