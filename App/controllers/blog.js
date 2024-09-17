let Validator = require('validatorjs');
const blogModel = require('../models/blogModel');
const BlogSchema = require('./validation-schemas/blogSchema');
const DateHelper = require('../helpers/DateHelper');

exports.createBlog = async (req, res) => {
    let rules = BlogSchema.create;
    var request = req.body;
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
 
    // Models Init     
    // End Models Init      

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
       formattedToday = dd + '/' + mm + '/' + yyyy;

    let data = {  
        title: request?.title,
        category: request?.category,
        author: request?.author,
        date: formattedToday ,// request?.date,
        image: request?.image,
        description: request?.description,
        metaDescription: request?.metaDescription
      }
      data.urlTitle = data?.title?.replace(/\s+/g, '-');
    let  blog = await blogModel.createBlog(data);
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

exports.getBlogById = async(req,res)=>{
    var request = req.body;
    let rules = {"blog_id":"required"}
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.blog_id
    }
    let data = await blogModel.getBlogById(filter)
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

exports.getBlogs = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 250000,
        skip:request?.skip ? request?.skip : 0,
        sort: {'_id': -1}
    }
    console.log(opotions,'Deepak');
    let data = await blogModel.getAllBlog(opotions)
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

exports.editBlog = async(req,res)=>{
    var request = req.body;
    let rules = {"blog_id":"required"}
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.blog_id
    }
    let update;
    if(request?.data){
        update = request.data;
    }
    let data = await blogModel.updateBlog(filter,update)
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

exports.deleteblog = async(req,res)=>{
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
    
    let data = await blogModel.removeBlog(filter)
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