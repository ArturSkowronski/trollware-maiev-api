'use strict';

var expect = require("chai").expect;

var $ = require('../src/modules/gameSession.js');


describe('Game Session', function () {

  
  describe('created by Player 11111', function () {
    
    var creatorName = {id: "11111"};

    before(function() {
      $.createGameModel(creatorName);
    });

    it('should be selectable by Game ID "11111"', function () {
      var gameObject = $.gameByGameID("11111");

      expect(gameObject.id).to.equal("11111");
      expect(gameObject).to.have.property('id', "11111");
      expect(gameObject).to.have.property('players').with.length(1);
      expect(gameObject).to.have.property('players').to.include("11111");
      expect(gameObject).to.have.property('scores').with.length(0);
    });

    it('should be selectable by Player ID "11111"', function () {
      var gameObject = $.gameByPlayerID("11111");
      expect(gameObject).to.have.property('id', "11111");
      expect(gameObject).to.have.property('players').with.length(1);
      expect(gameObject).to.have.property('players').to.include("11111");
      expect(gameObject).to.have.property('scores').with.length(0);
    });

    it('should have index 0 while selected by Game ID "11111"', function () {
      var gameIndex = $.indexOfGameByGameID("11111");
      expect(gameIndex).to.equals(0);
    });
    
    it('should have index 0 while selected by Player ID "11111"', function () {
      var gameIndex = $.indexOfGameByPlayerID("11111");
      expect(gameIndex).to.equals(0);
    });

    describe('and added player 22222', function () {

      var playerName = 22222;

      before(function() {
        $.addPlayer(creatorName);
      });

    });

  
  });
});
