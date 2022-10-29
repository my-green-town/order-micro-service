const express = require('express');
const router = express.Router();
const OrderRoute = require('./order.route');
const assignmentRoute = require('./assignment.route');
const processingRoutes = require('./processing.route');
const shipmentRoutes = require('./shipment.route')
const jwt = require('jsonwebtoken');

let routes  = (app)=>{
    console.log("came inside route function");
    // predicate the router with a check and bail out when needed
    
    app.use('/api/order',router, OrderRoute);
    app.use('/api/order/assignment',router, assignmentRoute);
    app.use('/api/order/processing',router, processingRoutes);
    app.use('/api/order/shipment',router, shipmentRoutes);
    app.use(handleError)
}

const handleError = (error,req,res,next)=>{
    res.json({status:"error",msg:error.message});
}

router.use((req,res,next)=>{
    console.log("req path is", req.path);
   
    const {tokenCheck} = req.body;
    if(tokenCheck == false){
        //bypass token check
        console.log("token check pass");
        return next();
    }
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token){
        req.token = token;
        token = token.slice(7, token.length);
        
        jwt.verify(token, 'secret', function(err, decoded) {
            if(err) {
                console.log("Error",decoded);
                let err = {status:"err",msg:"Invalid token"}
                res.status(403).json({err})
            } else {
                let date = new Date();
                if(decoded.exp *1000 < Date.now()){
                    let err = {status:"Error",msg:"Token Expired"}
                    res.status(403).json({err})
                } else {
                    if(decoded.data)
                    console.log("token cheeck passsss");
                    req.userInfo = decoded.data;
                    next()

                }
                
            }
        });
    }else{
        //need to handle option preflight request
        let err = {status:"Error",msg:"Invalid Reqest"};
        res.status(200).json(err)
    }
});     

module.exports = routes;









