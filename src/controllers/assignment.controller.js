
const messgaeQService = require('../services/messageQueue');
const assigmentService  = require('../services/assigment.service')
const intialPushToOrderMsgQueue = async (req, res,next)=>{
    try{    
        await messgaeQService.checkup()
        await pushOrdersToOrdersQueue();

    }catch(err){
        next(err)
    }
} 



const assignManual = async (req, res, next)=>{
    try {
        await assigmentService.manual.assign(req.body);
        return res.json({msg:"Order assigned successfully"})
    } catch(err) {
        next(err)
    }
}
const check  = async (req, res, next)=>{
    try{
        res.json("check inside assigmet called");
    }catch(err){

    }
}

module.exports = {
    intialPushToOrderMsgQueue,
    assignManual,
    check
}
