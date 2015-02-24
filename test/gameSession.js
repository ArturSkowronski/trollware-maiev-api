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

    it('should be undefined while selectable by Game ID "00000"', function () {
      var gameObject = $.gameByGameID("00000");

      expect(gameObject).to.equals(undefined);
    });

    it('should be undefined while selectable by Player ID "00000"', function () {
      var gameObject = $.gameByPlayerID("00000");
      expect(gameObject).to.equals(undefined);
    });

    it('should have index 0 while selected by Game ID "11111"', function () {
      var gameIndex = $.indexOfGameByGameID("11111");
      expect(gameIndex).to.equals(0);
    });
    
	it('should have index -1 while selected by Player ID "00000"', function () {
      var gameIndex = $.indexOfGameByPlayerID("00000");
      expect(gameIndex).to.equals(-1);
    });

    it('should have index -1 while selected by Game ID "00000"', function () {
      var gameIndex = $.indexOfGameByGameID("00000");
      expect(gameIndex).to.equals(-1);
    });

    it('should have index 0 while selected by Player ID "11111"', function () {
      var gameIndex = $.indexOfGameByPlayerID("11111");
      expect(gameIndex).to.equals(0);
    });

    describe('and with added player 22222', function () {

      var playerName = "22222";

      before(function() {
        $.addPlayerToGame(playerName, "11111");
      });
	
	  it('should not be selectable by Game ID "22222"', function () {
	    var gameObject = $.gameByGameID("22222");
        expect(gameObject).to.equals(undefined);
	  });

	  it('should be selectable by Player ID "22222"', function () {
	    var gameObject = $.gameByPlayerID("22222");
	    expect(gameObject).to.have.property('id', "11111");
	    expect(gameObject).to.have.property('players').with.length(2);
	    expect(gameObject).to.have.property('players').to.include("11111");
	    expect(gameObject).to.have.property('players').to.include("22222");
	    expect(gameObject).to.have.property('scores').with.length(0);
	  });

	  it('should have index 0 while selected by Player ID "22222"', function () {
        var gameIndex = $.indexOfGameByPlayerID("22222");
        expect(gameIndex).to.equals(0);
      });
    });

    describe('but when another Game Session is created by Player 33333', function () {

      var secondCreatorName = {id: "33333"};

      before(function() {
        $.createGameModel(secondCreatorName);
      });
	
	  it('should be selectable by Game ID "33333"', function () {
	    var gameObject = $.gameByPlayerID("33333");
	    expect(gameObject).to.have.property('id', "33333");
	    expect(gameObject).to.have.property('players').with.length(1);
	    expect(gameObject).to.have.property('players').to.include("33333");
	    expect(gameObject).to.have.property('scores').with.length(0);
	  });

	  it('should be selectable by Player ID "33333"', function () {
	    var gameObject = $.gameByPlayerID("33333");
	    expect(gameObject).to.have.property('id', "33333");
	    expect(gameObject).to.have.property('players').with.length(1);
	    expect(gameObject).to.have.property('players').to.include("33333");
	    expect(gameObject).to.have.property('scores').with.length(0);
	  });

	  it('should have index 1 while selected by Game ID "33333"', function () {
        var gameIndex = $.indexOfGameByGameID("33333");
        expect(gameIndex).to.equals(1);
      });

      it('should have index 1 while selected by Player ID "33333"', function () {
        var gameIndex = $.indexOfGameByPlayerID("33333");
        expect(gameIndex).to.equals(1);
      });

      it('and still original game should be selectable by Game ID "11111"', function () {
	    var gameObject = $.gameByGameID("11111");
	    expect(gameObject).to.have.property('id', "11111");
	    expect(gameObject).to.have.property('players').with.length(2);
	    expect(gameObject).to.have.property('players').to.include("11111");
	    expect(gameObject).to.have.property('players').to.include("22222");
	    expect(gameObject).to.have.property('scores').with.length(0);
	  });

	  it('and still original game should have index 0 while selected by Game ID "11111"', function () {
	    var gameIndex = $.indexOfGameByGameID("11111");
	    expect(gameIndex).to.equals(0);
	  });
    });

  });
});
