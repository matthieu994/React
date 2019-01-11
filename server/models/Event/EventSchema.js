var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var PaymentSchema = require("./PaymentSchema");
var EventUserSchema = require("./EventUserSchema");

const EventSchema = new Schema({
    users: [EventUserSchema],
    payments: [PaymentSchema],
    code: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('EventSchema', EventSchema);