let Validator = require('validatorjs');
const testimonialModel = require('../models/testimonialModel');
const BlogSchema = require('./validation-schemas/blogSchema');

exports.createtestimonial = async (req, res) => {
    let rules = { "name": "required", "designation": "required", "imageURL": "required", "description": "required" };
    var request = req.body;
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }

    // Models Init     
    // End Models Init      
    let data = {
        name: request?.name,
        designation: request?.designation,
        image: request?.imageURL,
        description: request?.description,
    }
    let blog = await testimonialModel.createtestimonial(data);
    if (blog) {
        return res.json({
            code: 200,
            data: blog,
            message: "Blog Create has been successfully",
        });
    } else {
        return res.json({
            code: 200,
            message: "Something Went Wrong",
        });
    }
}

exports.gettestimonialById = async (req, res) => {
    var request = req.body;
    let rules = { "testimonial_id": "required" }
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id: request?.testimonial_id
    }
    let data = await testimonialModel.gettestimonialById(filter)
    if (data) {
        return res.json({
            code: 200,
            data: data
        })
    } else {
        return res.json({
            code: 200,
            data: []
        })
    }
}

exports.gettestimonials = async (req, res) => {
    var request = req.body;
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let opotions = {
        limit: request?.limit ? request?.limit : 5000,
        skip: request?.skip ? request?.skip : 0,
        sort: { createdAt: -1 }
    }
    let data = await testimonialModel.getAlltestimonial(opotions)
    if (data) {
        return res.json({
            code: 200,
            data: data
        })
    } else {
        return res.json({
            code: 200,
            data: []
        })
    }
}

exports.edittestimonial = async (req, res) => {
    var request = req.body;
    let rules = { "testimonial_id": "required" }
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id: request?.testimonial_id
    }
    let update;
    if (request?.data) {
        update = request.data;
    }
    let data = await testimonialModel.updatetestimonial(filter, update)
    if (data) {
        return res.json({
            code: 200,
            data: data
        })
    } else {
        return res.json({
            code: 200,
            data: []
        })
    }
}

exports.deletetestimonial = async (req, res) => {
    var request = req.body;
    let rules = { "testimonial_id": "required" }
    let validation = new Validator(request);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    let filter = {
        _id: request?.testimonial_id
    }

    let data = await testimonialModel.removetestimonial(filter)
    if (data) {
        return res.json({
            code: 200,
            data: data
        })
    } else {
        return res.json({
            code: 200,
            data: []
        })
    }
}