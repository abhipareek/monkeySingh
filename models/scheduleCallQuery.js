var mongoose = require("mongoose");

var ScheduleCallQuerySchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    companyName: String,
    message: String,
    date: Date,
    source: String
},{timestamps:true});

module.exports = mongoose.model("ScheduleCallQuery", ScheduleCallQuerySchema);
