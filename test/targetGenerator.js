'use strict';

var expect = require("chai").expect;

var $ = require('../src/modules/targetGenerator.js');

describe('Target Generator', function () { 
	it('should return a new target with proper structure', function () {
		var target = $.generate().next().value;
		expect(target).to.have.property('type').to.be.a('string');
		expect(target).to.have.property('score').to.be.a('number');
	});
});