var mongoose = require("mongoose");

var ProjectSchema = new mongoose.Schema({
    title: String,
    category: String,
    date: String,
    state: String,
    url: String,
    user: String,
},{timestamps:true});

module.exports = mongoose.model("Project", ProjectSchema);