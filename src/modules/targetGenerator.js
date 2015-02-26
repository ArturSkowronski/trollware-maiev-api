/*eslint-disable no-constant-condition*/

"use strict";

var winston = require("winston");
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: "debug" })
  ]
});

var createTarget,
  randomizeTarget,
  random;

var generate = function* () {
  while (true) {
    log.debug("TargetGenerator Event yielded");
    yield createTarget();
  }
};

createTarget = function () {
  var target = randomizeTarget();
  log.debug("Target Created");
  return target;
};

randomizeTarget = function () {
  var typeOfItems = {}, model, math = random(0, 2);
  typeOfItems.good = "good";  typeOfItems.bad = "bad";

  switch(math) {
    case 0:
      model = {
        type: typeOfItems.good,
        score: 1
      };
      log.debug("Generated Good Target");
      break;
    case 1:
      model = {
        type: typeOfItems.bad,
        score: -1
      };
      log.debug("Generated Bad Target");
      break;
  }

  return model;
};

random = function (low, high) {
  return Math.floor((Math.random() * high));
};

exports.generate = generate;
