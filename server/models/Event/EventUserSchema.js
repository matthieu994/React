var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PaymentSchema = require("./PaymentSchema");
var EventSchema = require("./EventSchema");

const EventUserSchema = new Schema({
    _id: false,
    userId: String,
    payments: [PaymentSchema],
    events: [EventSchema]
})

module.exports = mongoose.model('EventUser', EventUserSchema);