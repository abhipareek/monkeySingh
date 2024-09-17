let Validator = require('validatorjs');
const portfolioModel = require('../models/portfolioModel');

exports.getportfolios = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 50000,
        skip: request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await portfolioModel.getportfolioList({}, {}, opotions)
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

exports.createportfolio = async (req, res) => {
    let rules = {"category": "required","imageURL": "required" };
    var request = req.body;
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
 
    // Models Init     
    // End Models Init      
    let data = {  
        category: request?.category,
        image: request?.imageURL,
        description: request?.description,

      }
    let  blog = await portfolioModel.createportfolio(data);
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

exports.getportfolioById = async(req,res)=>{
    var request = req.body;
    let rules = {"portfolio_id":"required"}
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.portfolio_id
    }
    let data = await portfolioModel.getportfolioById(filter)
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

exports.editportfolio = async(req,res)=>{
    var request = req.body;
    let rules = {"portfolio_id":"required"}
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.portfolio_id
    }
    let update;
    if(request?.data){
        update = request.data;
    }
    let data = await portfolioModel.updateportfolio(filter,update)
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

exports.deleteportfolio = async(req,res)=>{
    var request = req.body;
    let rules = {"portfolio_id":"required"}
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id :request?.portfolio_id
    }
    
    let data = await portfolioModel.removeportfolio(filter)
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