var mongoose = require("mongoose");

var WatchDemoSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    companyName: String,
    message: String,
    date: String,
},{timestamps:true});

module.exports = mongoose.model("WatchDemo", WatchDemoSchema);
