const mongoose = require('mongoose');
const forEachAsync = require('foreachasync').forEachAsync;
var portfolioTable = require('../../models/work');
var dateHelper = require('../helpers/DateHelper');


module.exports.getportfolioList = (args = {}, projection = {}, options) => {
    return new Promise((resolve, reject) => {
        portfolioTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};


module.exports.getportfolio = (args = {}, projection = {}) => {
    return new Promise((resolve, reject) => {
        portfolioTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.createportfolio = (data = {}) => {
    return new Promise((resolve, reject) => {
        portfolioTable.create(data, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });

    });
};

module.exports.updateportfolio = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        portfolioTable.updateOne(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

module.exports.updateportfolios = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        portfolioTable.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.removeportfolio = (args = {}) => {
    return new Promise(async (resolve, rejecct) => {
        portfolioTable.deleteOne(args, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve();
            }
        })
    })
}

/** Monkey singh portfolio Models **/

module.exports.getportfolioById = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        await module.exports.getportfolio(args).then((result) => {
            if (result) {
                let response = {
                    "category": result?.category,
                    "image": result?.image,
                    "date": ""
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
module.exports.getAllportfolio = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        await module.exports.getportfolioList({}, {}, args).then(async (result) => {
            if (result) {
                await forEachAsync(result, async (element) => {
                    let responseObj = {
                        "category": element?.category,
                        "image": element?.image,
                        "date": ""
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