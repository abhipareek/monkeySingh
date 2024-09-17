const mongoose = require('mongoose');
const forEachAsync = require('foreachasync').forEachAsync;
var dateHelper = require('../helpers/DateHelper');
var TestimonialTable = require('../../models/testimonial');
/** Monkey singh portfoleio Models **/

module.exports.gettestimonialList = (args = {}, projection = {}, options) => {
    return new Promise((resolve, reject) => {
        TestimonialTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.gettestimonial = (args = {}, projection = {}) => {
    return new Promise((resolve, reject) => {
        TestimonialTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.createtestimonial = (data = {}) => {
    return new Promise((resolve, reject) => {
        TestimonialTable.create(data, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });

    });
};

module.exports.updatetestimonial = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        TestimonialTable.updateOne(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

module.exports.updatetestimonials = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        TestimonialTable.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.removetestimonial = (args = {}) => {
    return new Promise(async (resolve, rejecct) => {
        TestimonialTable.deleteOne(args, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve();
            }
        })
    })
}

/** Monkey singh portfoleio Models **/

module.exports.gettestimonialById = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        await module.exports.gettestimonial(args).then((result) => {
            if (result) {
                let response = {
                    name: result?.name,
                    designation: result?.designation,
                    image: result?.image,
                    description: result?.description,
                    date:""
                }
                if (result?.createdAt) {
                    response.date = dateHelper.toFormatDateInFormatwithTime(result?.createdAt);
                }
                resolve(response);
            } else {
                resolve();
            }
        })
    })
}
module.exports.getAlltestimonial = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        await module.exports.gettestimonialList({}, {}, args).then(async (result) => {
            if (result) {
                await forEachAsync(result, async (element) => {
                    let responseObj = {
                        name: element?.name,
                        designation: element?.designation,
                        image: element?.image,
                        description: element?.description,
                        date:""
                    }
                    if (element?.createdAt) {
                        responseObj.date = dateHelper.toFormatDateInFormatwithTime(element?.createdAt);
                    }
                    response.push(responseObj);
                })

                resolve(response);
            } else {
                resolve();
            }
        })
    })
}