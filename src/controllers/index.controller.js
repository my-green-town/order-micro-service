const order = require('./order.controller');
const shipment = require('./shipment.controller');
module.exports = {
    order:{...order},
    shipment:{...shipment}
}