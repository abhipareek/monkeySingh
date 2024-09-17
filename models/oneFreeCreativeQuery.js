var mongoose = require("mongoose");

var OneFreeCreativeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    companyName: String,
    message: String,
    date: Date
},{timestamps:true});

module.exports = mongoose.model("OneFreeCreativeQuery", OneFreeCreativeSchema);
