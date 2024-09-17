var mongoose = require("mongoose");

var WorkSchema = new mongoose.Schema({
  category: String,
  image: String,
  description:String,
},{timestamps:true});

module.exports = mongoose.model("Work", WorkSchema);
