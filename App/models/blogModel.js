const mongoose = require('mongoose');
const forEachAsync = require('foreachasync').forEachAsync;
var BlogTable = require('../../models/blog');
/** Monkey singh Blog Models **/

module.exports.getBlogList = (args = {}, projection = {},options) => {
    return new Promise((resolve, reject) => {
        BlogTable.find(args, projection,options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getBlog = (args = {}, projection = {}) => {
    return new Promise((resolve, reject) => {
        BlogTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.createBlog = (data = {}) => {
    return new Promise((resolve, reject) => {
        BlogTable.create(data, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });

    });
};

module.exports.updateBlog = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        BlogTable.updateOne(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

module.exports.updateBlogs = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        BlogTable.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.removeBlog = (args={})=>{
    return new Promise(async(resolve,rejecct)=>{
        BlogTable.deleteOne(args,function(err,result){
            if(result){
                resolve(true);
            }else{
                resolve();
            }
        })
    })
}

/** Monkey singh Blog Models **/

module.exports.getBlogById = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        await module.exports.getBlog(args).then((result) => {
            if (result) {
                let response = {
                    "author": result?.author,
                    "title": result?.title,
                    "category": result?.category,
                    "description": result?.description,
                    "date": result?.date ? result?.date : "",
                    "image": result?.image,
                    "urlTitle": result?.urlTitle,
                    "metaDescription": result?.metaDescription,
                }
                resolve(response);
            }else{
                resolve();
            }
        })
    })
}
module.exports.getAllBlog = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        let response=[];
        await module.exports.getBlogList({},{},args).then(async(result) => {
            if (result) {
                await forEachAsync(result,async(element)=>{
                    let responseObj = {
                        "author": element?.author,
                        "title": element?.title,
                        "category": element?.category ?element?.category:'',
                        //"description": element?.description,
                        "date":  element?.date ? element?.date : "",
                        "image": element?.image,
                        "urlTitle": element?.urlTitle,
                        "metaDescription": element?.metaDescription,
                        "id":element?._id.toString(),
                    }
                    response.push(responseObj);
                })
                
                resolve(response);
            }else{
                resolve();
            }
        })
    })
}