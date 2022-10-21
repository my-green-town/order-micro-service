const processingService = require('../services/processing');
const saveCount = async (req, res,next)=>{
    try{    
        await processingService.updateCount(req.body)
        res.json({msg:"Count updated Successfully"}).status(200)
    }catch(err){
        next(err)
    }
} 


module.exports = {
    saveCount
}
