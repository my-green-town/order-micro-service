const express = require('express');
const app = express();
const http = require('http');
require('./config/index')();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Host");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true); 
    next();
});

require('./src/event-emitters/order');

app.use((req, res,next)=>{
    console.log("path is===>",req.path);
    next()
})

let productroutes = require('./src/routes/index.router');
productroutes(app);

app.use(function(req,res){
    res.status(404).json({msg:'Resource Not Found'});
});
const port = 4003;
http.createServer(app).listen(port,()=>{
    console.log(`Order App is listening at ${port}`);
});
