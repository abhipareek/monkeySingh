const AuthUser = require("../models/Authentication.model");
module.exports.getUser = (args = {}, projection = {}, options = {}) => {
    return new Promise((resolve, reject) => { 
AuthUser.findOne(args, projection, options).then((result) => { 
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.getUsers = (args = {}, projection = {}) => {
    return new Promise((resolve, reject) => {
        AuthUser.find(args, projection).lean().then((result) => {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};


module.exports.addUser = (args = {}) => {
    return new Promise((resolve, reject) => {
        AuthUser.create(args ).then((result) => {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};

module.exports.updateuser = (args = {}, data) => {
    return new Promise((resolve, reject) => {
        var updatedata = {
            '$set': data
        };

        AuthUser.updateOne(args, updatedata).then((result) => {
            if (result) {
                resolve(true);
            } else {
                resolve(false);

            }
        });
    });
}


module.exports.removeparkOrder = (args = {}) => {
    return new Promise((resolve, reject) => {
        AuthUser.deleteOne(args, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        })
    });
};
