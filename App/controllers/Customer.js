let Validator = require('validatorjs'); 
const forEachAsync = require('foreachasync').forEachAsync; 
const custoerModel = require('../models/Customer.model'); 
const CustomerSchema = require('./validation-schemas/CustomerSchema'); 
exports.getList = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 50000,
        skip:request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await custoerModel.getAllCustomers(opotions)
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
 
exports.supportRickets = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 50000,
        skip:request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await custoerModel.getAllSupports(opotions)
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

exports.watchdemos = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 50000,
        skip:request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await custoerModel.getAllwatchdemos(opotions)
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
exports.onefreecreative = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 50000,
        skip:request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await custoerModel.getAllonefreecreative(opotions)
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
exports.schedulecallqueries = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 50000,
        skip:request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await custoerModel.getAllschedulecallqueries(opotions)
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
exports.projects = async(req,res)=>{
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit:request?.limit ? request?.limit : 50000,
        skip:request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await custoerModel.getAllprojects(opotions)
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