const mongoose = require('mongoose');
const forEachAsync = require('foreachasync').forEachAsync;
var StoryTable = require('../../models/story');
var dateHelper = require('../helpers/DateHelper');
/** Monkey singh story Models **/

module.exports.getStoryList = (args = {}, projection = {}, options) => {
    return new Promise((resolve, reject) => {
        StoryTable.find(args, projection, options, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getStory = (args = {}, projection = {}) => {
    return new Promise((resolve, reject) => {
        StoryTable.findOne(args, projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.createStory = (data = {}) => {
    return new Promise((resolve, reject) => {
        StoryTable.create(data, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });

    });
};

module.exports.updateStory = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        
        StoryTable.updateOne(args, updateData, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

module.exports.updateStorys = (args, data) => {
    return new Promise((resolve, reject) => {
        var updateData = {
            '$set': data

        };
        StoryTable.updateMany(args, updateData, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.removeStory = (args = {}) => {
    return new Promise(async (resolve, rejecct) => {
        StoryTable.deleteOne(args, function (err, result) {
            if (result) {
                resolve(true);
            } else {
                resolve();
            }
        })
    })
}

/** Monkey singh story Models **/

module.exports.getStoryById = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        await module.exports.getStory(args).then((result) => {
            if (result) {
                let response = {
                    "videoURL": result?.videoURL,
                    "imageURL": result?.imageURL,
                    "description": result?.description,
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
module.exports.getAllStory = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        await module.exports.getStoryList({}, {}, args).then(async (result) => {
            if (result) {
                await forEachAsync(result, async (element) => {
                    let responseObj = {
                        "videoURL": element?.videoURL,
                        "imageURL": element?.imageURL,
                        "description": element?.description,
                        "date": "",
                        "id":element?._id.toString(),

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