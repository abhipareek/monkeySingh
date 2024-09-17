let Validator = require('validatorjs');
const storyModel = require('../models/storyModel');
const BlogSchema = require('./validation-schemas/blogSchema');

exports.createstory = async (req, res) => {
    let rules = {"videoURL": "required","description": "required"};
    var request = req.body;
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
 
    // Models Init     
    // End Models Init      
    let data = {  
        videoURL: request?.videoURL,
        imageURL: request?.imageURL,
        description: request?.description,
      }
    let  blog = await storyModel.createStory(data);
    if(blog){
        return res.json({
            code: 200,
            data: blog,
            message: "Blog Create has been successfully",
        });
    }else{
        return res.json({
            code: 200,
            message: "Something Went Wrong",
        });
    }
}

exports.getstoryById = async(req,res)=>{
    var request = req.body;
    let rules = {"story_id":"required"}
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.story_id
    }
    let data = await storyModel.getStoryById(filter)
    if(data){
        return res.json({
            code:200,
            data:data
        })
    }else{
        return res.json({
            code:200,
            data:[]
        })
    }
}

exports.getstorys = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 5000,
        skip: request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await storyModel.getAllStory(opotions)
    if(data){
        return res.json({
            code:200,
            data:data
        })
    }else{
        return res.json({
            code:200,
            data:[]
        })
    }
}

exports.editstory = async(req,res)=>{
    var request = req.body;
    let rules = {"story_id":"required"}
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.story_id
    }
    let update;
    if(request?.data){
        update = request.data;
    }
    let data = await storyModel.updateStory(filter,update)
    if(data){
        return res.json({
            code:200,
            data:data
        })
    }else{
        return res.json({
            code:200,
            data:[]
        })
    }
}

exports.deletestory = async(req,res)=>{
    var request = req.body;
    let rules = {"id":"required"}
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.id
    }
    
    let data = await storyModel.removeStory(filter)
    if(data){
        return res.json({
            code:200,
            data:data
        })
    }else{
        return res.json({
            code:200,
            data:[]
        })
    }
}