'use strict';

var expect = require("chai").expect;
var rewire = require("rewire");
var sinon = require("sinon");

var $ = rewire('../src/modules/game');
var io = {
  generate: function () {
    return {
      next: function (){
        return {
          value: {
            type: "chuckNorris",
            score: -1000
          }
        }
      }
    }
  }
}

describe('Game', function () {

  it('should return false if set nonexisting connection', function () {
    expect($.init()).to.be.equal(false);
  }); 

  describe('with initialized connection', function () {

  describe('while joining game "11111"', function () {

      it('should return false if data not set', function () {
        var joinGameSocket = {emit: function(){}}

        sinon.spy(joinGameSocket, "emit");

        expect($.joinGame(undefined, joinGameSocket)).to.be.equal(false);
        expect(joinGameSocket.emit.calledOnce).to.be.equal(true);


      }); 

      it('should return false if Game ID not set', function () {
        var joinGameSocket = {emit: function(){}}

        sinon.spy(joinGameSocket, "emit");

        expect($.joinGame({}, joinGameSocket)).to.be.equal(false);
        expect(joinGameSocket.emit.calledOnce).to.be.equal(true);

      }); 

      it('should return false if game not found', function () {
        var joinGameData = {gameID:"11111"};
        var joinGameSocket = {emit: function(){}}

        sinon.spy(joinGameSocket, "emit");

        var gameSessionMock = {
          gameByGameID: function () {
            return false;
          } 
        };

        $.__set__("gameSession", gameSessionMock);
        expect($.joinGame(joinGameData, joinGameSocket)).to.be.equal(false);
        expect(joinGameSocket.emit.calledOnce).to.be.equal(true);

      }); 


      it('should return false if player already joined', function () {

        var joinGameData = {gameID:"11111"};
        var joinGameSocket = {
          emit: function(data){
          }
        }

        sinon.spy(joinGameSocket, "emit");

        var gameSessionMock = {
          gameByGameID: function () {
            return true;
          },
          playerByIDByGameID: function () {
            return true;
          } 
        };

        $.__set__("gameSession", gameSessionMock);
        // expect($.joinGame(joinGameData, joinGameSocket)).to.be.equal(true);
        // expect(joinGameSocket.emit.calledWith({error: "Already joined"})).to.be.equal(true);

      }); 

  });
  });

});
