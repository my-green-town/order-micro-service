
const OrderController = require('../src/modules/products/controllers/order.controller');
const service = require('../src/modules/auth/oauth/user.service');
const db = require('../models/index');
const Order = db.Order;
const chai = require("chai");
var sandbox = require("sinon").createSandbox();
const expect = chai.expect;
const assert = chai.assert;
const { google } = require('googleapis');
const User = db.User;



const { spy } = require('sinon');

describe('check book slot', function () {

    let req = {
        body:{
            expectedPickupTime: "1638096260854",
        },
        userInfo: { userId: 1 }
    }
    
    let res = {
        json: function(){return this;},
        status:function(){return this;}
    }

    afterEach(function () {
        // completely restore all fakes created through the sandbox
        sandbox.restore();
    });

    /**
     * Stub the sequelize methods 
    */
    sandbox.stub(Order,"create")
    .resolves([{status:"booked success"}]);

    sandbox.spy(res,"json");
    sandbox.spy(res,"status");

    it('check for success slot-book', async  () => {
        await OrderController.bookPickupSlot(req, res);
        assert.isTrue(res.status(200).json.calledOnce);
        assert.isTrue(res.status(200).json
        .withArgs({"msg": "Great!! Pickup slot booked."}).calledOnce);

    })


   

    it('check for faliure slot-book', async  () => {

        
        sandbox.stub(Order,"create")
        .rejects({status:"booked fail"});

        sandbox.spy(res,"json");
        sandbox.spy(res,"status");
    
        await OrderController.bookPickupSlot(req, res);
        
        try{
            let createRes = await Order.create.returnValues[0];
        }catch(err){
            assert.isTrue(res.status(500).json.calledOnce);
            assert.isTrue(res.status(500)
            .json
            .withArgs({msg:"Error in booking slot, please try after some time"}).calledOnce);
        }
        
        
        

    })
})