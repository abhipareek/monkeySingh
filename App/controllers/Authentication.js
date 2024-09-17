let Validator = require('validatorjs');  
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
const UserModel = require('../services/Users');
const AiSchema = require('./validation-schemas/AiSchema');
let appConfig = require('../config/appConfig');  
let dateHelper = require('../helpers/DateHelper');  
exports.login = async (req, res) => {
    let rules = AiSchema.Login;
    var request = req.body;
    let validation = new Validator(request, rules);

    if (!validation.passes()) {
        var errors = validation.errors.all();
        return res.json({ code: 400, errors: errors });
    }
    
 
 let token="";
    let data = await UserModel.getUser({ email: request?.email.trim() });  
    if (data) { 
        check_password=await comparePassword(data?.password,request?.password);
        if(check_password){
        
          token =await  getToken( {id: data._id.toString(),email: data.email,profile: data.profileImage});  
   
        return res.json({
            code: 200,
            data: {name:request.name,authToken:token},
            //Message: "User update has been successfully",
        });

    }else{
        return res.json({
            code: 400, 
            message: "Invalid User and Password ",
        });
    }
    
    }else{
        return res.json({
            code: 400, 
            message: "Invalid User and Password Match ",
        });
    }
}

const getToken = async (userdata) => {

    // let userdata = {id: request.name,email: request.email,profile: request.email};
    let token =   jwt.sign(userdata, appConfig.JwtsecretKey, {
        algorithm: appConfig.Jwtalgorithm,
        expiresIn: '13h'
        //expiresIn: '20s'
        });  

        return token; 

}
 

  const hashPassword = async (password) => { 
    const hashedPwd = await bcrypt.hash(password, 10);
    return hashedPwd;
};

// Check if password is correct
  const comparePassword = async (password, userPassword) => {
   return await bcrypt.compare(userPassword, password);
    
   // const isMatch = await bcrypt.compare(password, userPassword);

     
};
 