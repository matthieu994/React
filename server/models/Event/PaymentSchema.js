var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EventUserSchema = require("./EventUserSchema");
var EventSchema = require("./EventSchema");

const PaymentSchema = new Schema({
    event: EventSchema,
    from: [EventUserSchema],
    to: [EventUserSchema],
    amount: [Integer],
    comment: String
})

module.exports = mongoose.model('Payment', PaymentSchema);