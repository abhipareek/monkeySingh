var mongoose = require("mongoose");

var WorkCategorySchema = new mongoose.Schema({
    category: String,
},{timestamps:true});

module.exports = mongoose.model("WorkCategory", WorkCategorySchema);
