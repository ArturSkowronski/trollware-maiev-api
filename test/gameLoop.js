'use strict';

var expect = require("chai").expect;
var rewire = require("rewire");

var $ = rewire('../src/modules/gameLoop');
var targetGeneratorMock = {
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

describe('Game Loop', function () {
  var gameSession = {id: "11111"}; 
  
  before(function (){
    $.__set__("targetGenerator", targetGeneratorMock);
  })

  it('start should return initial target with proper structure', function () {
    var target = $.gameLoop(gameSession).start();
    expect(target).to.have.property('type').to.be.a('string').to.be.equal("chuckNorris");
    expect(target).to.have.property('score').to.be.a('number').to.be.equal(-1000);
  }); 
});
