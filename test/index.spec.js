
const controller = require('../src/modules/auth/oauth/google.auth');
const service = require('../src/modules/auth/oauth/user.service');
const db = require('../models/index');
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const assert = chai.assert;
const User = db.User;



const { spy } = require('sinon');
describe("smoke test", function() {
  it("checks equality", function() {
    expect(true).to.be.true;
  });
});

