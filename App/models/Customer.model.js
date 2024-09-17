const mongoose = require('mongoose');
const forEachAsync = require('foreachasync').forEachAsync; 
const CustomerTable =  require('../../models/user');
const supportTabel = require('../../models/contactQuery')
const watchdemoTable = require('../../models/watchdemo')
const oneFreeCreativeQueryTable = require('../../models/oneFreeCreativeQuery')
const scheduleCallQueryTable = require('../../models/scheduleCallQuery')
const dateHelper = require('../helpers/DateHelper')
const projectTable = require('../../models/project')
/** Gis Customer Models **/
 
module.exports.findWithId = (args) => {
    return new Promise((resolve, reject) => {        
            CustomerTable.findOne(args).lean().then(async (result) => {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        });
    });
};

module.exports.Customers= (args={},projection={}) => {
    return new Promise((resolve, reject) => {
        CustomerTable.find(args,projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.allSupports= (args={},projection={}) => {
    return new Promise((resolve, reject) => {
        supportTabel.find(args,projection, function (err, result) {
            if (result) {
                resolve(result);
            } else {
                resolve();
            }
        }).lean();
    });
};

module.exports.getAllCustomers = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        await module.exports.Customers({}, {}, args).then(async (result) => {
            if (result) {
                await forEachAsync(result, async (element) => {
                    let responseObj = {
                        "name": element?.firstName + " " + element?.lastName,
                        "email": element?.email ?  element?.email :'',
                        "username":element?.username ?element?.username:'',
                        "subscriptionId":element?.subscriptionId ? element?.subscriptionId:'',
                        "subscriptionStatus":element?.subscriptionStatus ?element?.subscriptionStatus:'' ,
                        "current_end":element?.current_end ? element?.current_end:'',
                        "date": ""
                    }
                    if (element?.dateRegistered) {
                        responseObj.date = dateHelper.toFormatDateInFormatwithTime(element?.dateRegistered);
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

module.exports.getAllSupports = async (args = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        await module.exports.allSupports({}, {}, args).then(async (result) => {
            if (result) {
                await forEachAsync(result, async (element) => {
                    if(element?.name){ 
                    let responseObj = {
                        "name": element?.name ?element?.name:'',
                        "email": element?.email ?element?.email:'',
                        "phoneNumber":element?.phoneNumber ?element?.phoneNumber:'',
                        "companyName":element?.companyName ?element?.companyName:'',
                        "message":element?.message ?element?.message:'',
                            "date": ""
                        }
                        if (element?.date) {
                            responseObj.date = dateHelper.toFormatDateInFormatwithTime(element?.date);
                        }
                    response.push(responseObj);

                }else{
                    
                    //  await module.exports.removeSupport({_id:element?._id});
                }
                })

                resolve(response);
            } else {
                resolve();
            }
        })
    })
}  


module.exports.isEmailValid = async (email = {}) => {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}


module.exports.removeSupport = (args={})=>{
    return new Promise(async(resolve,rejecct)=>{
        supportTabel.deleteOne(args,function(err,result){
            if(result){
                resolve(true);
            }else{
                resolve();
            }
        })
    })
}




module.exports.getAllwatchdemos = async (args = {}, projection = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        //await module.exports.allSupports({}, {}, args).then(async (result) => {
        watchdemoTable.find(args, projection, async function (err, result) {

            if (result) {
                await forEachAsync(result, async (element) => {
                    if (element?.name) {
                        let responseObj = {
                            "name": element?.name ? element?.name : '',
                            "email": element?.email ? element?.email : '',
                            "phoneNumber": element?.phoneNumber ? element?.phoneNumber : '',
                            "companyName": element?.companyName ? element?.companyName : '',
                            "message": element?.message ? element?.message : '',
                            "date": ""
                        }
                        if (element?.date) {
                            responseObj.date = element?.date;
                        }
                        response.push(responseObj);

                    } else {

                        //  await module.exports.removeSupport({_id:element?._id});
                    }
                })

                resolve(response);
            } else {
                resolve();
            }
        })
    })
}


module.exports.getAllonefreecreative = async (args = {}, projection = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        //await module.exports.allSupports({}, {}, args).then(async (result) => {
        oneFreeCreativeQueryTable.find(args, projection, async function (err, result) {

            if (result) {
                await forEachAsync(result, async (element) => {
                    if (element?.name) {
                        let responseObj = {
                            "name": element?.name ? element?.name : '',
                            "email": element?.email ? element?.email : '',
                            "phoneNumber": element?.phoneNumber ? element?.phoneNumber : '',
                            "companyName": element?.companyName ? element?.companyName : '',
                            "message": element?.message ? element?.message : '',
                            "date": ""
                        }
                        if (element?.date) {
                            responseObj.date = dateHelper.toFormatDateInFormatwithTime(element?.date);
                        }
                        response.push(responseObj);

                    } else {

                        //  await module.exports.removeSupport({_id:element?._id});
                    }
                })

                resolve(response);
            } else {
                resolve();
            }
        })
    })
}
module.exports.getAllschedulecallqueries = async (args = {}, projection = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        //await module.exports.allSupports({}, {}, args).then(async (result) => {
        scheduleCallQueryTable.find(args, projection, async function (err, result) {

            if (result) {
                await forEachAsync(result, async (element) => {
                    if (element?.name) {
                        let responseObj = {
                            "name": element?.name ? element?.name : '',
                            "email": element?.email ? element?.email : '',
                            "phoneNumber": element?.phoneNumber ? element?.phoneNumber : '',
                            "companyName": element?.companyName ? element?.companyName : '',
                            "message": element?.message ? element?.message : '',
                            "date": ""
                        }
                        if (element?.date) {
                            responseObj.date = dateHelper.toFormatDateInFormatwithTime(element?.date);
                        }
                        response.push(responseObj);

                    } else {

                        //  await module.exports.removeSupport({_id:element?._id});
                    }
                })

                resolve(response);
            } else {
                resolve();
            }
        })
    })
}
module.exports.getAllprojects = async (args = {}, projection = {}) => {
    return new Promise(async (resolve, reject) => {
        let response = [];
        //await module.exports.allSupports({}, {}, args).then(async (result) => {
        projectTable.find(args, projection, async function (err, result) {

            if (result) {
                await forEachAsync(result, async (element) => {
                    if (element?.title) {
                        let responseObj = {
                            "title": element?.title ? element?.title : '',
                            "category": element?.category ? element?.category : '',
                            "date": element?.date ? element?.date : '',
                            "state": element?.state ? element?.state : '',
                            "url": element?.url ? element?.url : '',
                            "user": element?.user ? element?.user : '',
                            "id": element?._id ? element?._id : '',

                        }
                        response.push(responseObj);

                    } else {

                        //  await module.exports.removeSupport({_id:element?._id});
                    }
                })

                resolve(response);
            } else {
                resolve();
            }
        })
    })
} 
/** End Gis Customer Models **/