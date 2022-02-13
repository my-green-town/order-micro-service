
const authController = require('../src/modules/auth/oauth/google.auth');
const service = require('../src/modules/auth/oauth/user.service');
const db = require('../models/index');
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const assert = chai.assert;
const { google } = require('googleapis');
const User = db.User;



const { spy } = require('sinon');

describe('check for google login url', function(){
  /**
   * Don't know how to test google.auth object, actually don't know how to spy on its methods
  */

  let req = {
    get:()=>{return "localhost:4343/"}
  }
  const oauth2Client = new google.auth.OAuth2(
    '63185176944-liii4cl4p1oj30suhi75ouekpdact3jo.apps.googleusercontent.com',
    'asdasasdsada1232',
    req.get()
  );

  let res = {
    json:sinon.spy()
  }  

  let spyFunc = sinon.spy(oauth2Client,"generateAuthUrl");
  it('check res json is called', () => {

    authController.google(req,res);
    assert.isTrue(res.json.calledOnce);
  })
})

describe('test login function', function(){
    let req = {
      body:{
        emaild:"adsa@adas.com"
      }
    }
  
    let res = {
      json:function(){
        return this;
      },
      status:function(){
        return this;
      },
      send:function(){
        return this;
      }
    }  
  
    it('checks success login response', async() => {
      sinon.stub(User,'findAll')
      .resolves([{
        id: 1,
        emailId: 'adsa@adas543534.com',
        password: 'google1234',
        lastName: 'Kumar',
        firstName: 'Satyam',
        role: 'customer',
        address: null,
        mobileNo: null,
        provider: 'google',
        createdAt: '2021-11-05T15:59:48.000Z',
        updatedAt: '2021-11-05T15:59:48.000Z'
      }]);
      sinon.spy(res,"json");
      const loginServiceSpy = sinon.spy(service,"login");
      await authController.login(req,res);
      let afterLogin = await loginServiceSpy.returnValues[0];
      assert.isTrue(loginServiceSpy.calledOnce);
      assert.isTrue(res.json.withArgs({status:"success",data:afterLogin}).calledOnce);
    });

    afterEach(function () {
        User.findAll.restore(); // Unwraps the spy
        res.json.restore();
        service.login.restore();
    });

    it('checks failure login response', async() => {
        sinon.stub(User,'findAll')
        .resolves([]);
        sinon.spy(res,"json");
        sinon.spy(res,"status");
        sinon.spy(res,"send");

        const loginServiceSpy = sinon.spy(service,"login");
        await authController.login(req,res);
        try{
            await loginServiceSpy.returnValues[0];
        }catch(err){
            assert.isTrue(loginServiceSpy.calledOnce);
            assert.isTrue(res.status(403).send.withArgs({status:"Error",msg:"User Not found"}).calledOnce);
        }
      });
})

