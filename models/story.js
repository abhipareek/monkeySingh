var mongoose = require("mongoose");

var StorySchema = new mongoose.Schema({
    videoURL: String,
    imageURL: String,
    description: String,
},{timestamps:true});

module.exports = mongoose.model("Story", StorySchema);
