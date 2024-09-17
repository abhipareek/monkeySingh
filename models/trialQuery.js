var mongoose = require("mongoose");

var TrialQuerySchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    companyName: String,
    message: String,
},{timestamps:true});

module.exports = mongoose.model("TrialQuery", TrialQuerySchema);
