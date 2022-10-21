const myEmitter = require('./index');
//event when order is placed successfully
myEmitter.emitter.on('push_order', function (data) {
    console.log("push order event catched",data)
});

//event after order is placed, send email
myEmitter.emitter.on('send_order_placed_mail', function (data) {
    console.log("send mail when order is placed successfully",data)
});


