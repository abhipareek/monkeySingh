let jwt = require('jsonwebtoken');
let appConfig = require('../config/appConfig');  

const userAuth = async (req, res, next) => { 
    var Authorization = req.headers['authorization'];    
    if (!Authorization) {
        return res.json({
            code : 403,
            message : "Invalid Authorization"
        });
    } 
   // let payload = jwt.verify(Authorization, appConfig.JwtsecretKey);
    try {
        var decoded = jwt.verify(Authorization, appConfig.JwtsecretKey);
    global.USER_EMAIL = decoded?.email;
    global.USER_PROFILE= decoded?.profile;
    global.USER_ID = decoded?.id;

      } catch(err) {
        return res.json({
            code : 401,
            message : "Authorization has been expired"
        });
      }
  
     
    next();    
}
const userAuth1 = async (req, res, next) => { 
    var Authorization = req.headers['authorization'];    
    if (!Authorization) {
        return res.json({
            code : 403,
            message : "Invalid Authorization"
        });
    }

   // var data = await organizationModel.checkloginToken(Authorization);        
    if(Authorization!='ws1WQAMwap4tPJQFEHo0') { 
        return res.json({
            code : 401,
            message : "Authorization has been expired"
        });
    }   

    // if(data?.status != 1) { 
    //     return res.json({
    //         code : 403,
    //         message : "Your Account Is Suspended!"
    //     }); 
    // }  
 
    // global.ORG_DB = data?.database_name;
    // global.ORG_LANG = data?.admin?.language_list;
    // global.ORG_ID = data?.admin?.organisation_id;
    // global.USER_ID = data?.admin?.id;
    
   
    // res.locals.ORG_DB = data?.database_name;
    next();    
}
module.exports = userAuth; 