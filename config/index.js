module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            require('dotenv').config();

        case 'production':
            console.log("inside prod case");
            return require('dotenv').config({path:'./.env.prod'});

        default:
            return require('dotenv').config({path:'./.env'});
    }
};
