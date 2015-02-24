var _ = require('lodash')
var gameArray = [
{
id: "g61IuWmxO179GhI6AAAA",
players: [
"g61IuWmxO179GhI6AAAA"
],
scores: [ ]
}
]

gameByPlayerID = function (playerID) {
  return _.find(gameArray, function (item) {
    return _.includes(item.players, playerID);
  });
};

console.log(gameByPlayerID("g61IuWmxO179GhI6AAAA"));