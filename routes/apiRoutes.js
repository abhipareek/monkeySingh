let express = require('express');
let router = express.Router();
require('express-group-routes');

/** Routes **/
const appRoutes = require("../App/routes/appRoutes");  
/** End Routes **/

/** Inventory Middleware **/
const appVerifyAuthMiddleware = require("../App/middleware/VerifyAuth"); 
const Authentication = require("../App/controllers/Authentication"); 

/** End Inventory Middleware **/
 
router.get('/', function (req, res) {
    res.json({
        status: true,
        message: "Welcome to World Of Monkey Sing APIs"
    });
}); 

router.post('/admin-login', function (req, res) {

    var adminId = "cc1BkAATqxf52oZo2P3q";
    var adminPassword = "ws1WQAMwap4tPJQFEHo0";
    var name = req.body.name;
    var password = req.body.password;
  
    //let user = await User.findOne({ email: req.user.email })
  
  
    if (adminId == name && adminPassword == password) {
      
        res.json({
            status: true,
            message: "Welcome to World Of Monkey Sing APIs",
            code:adminPassword,
        });
    } else {
        res.json({
            status: false,
            message: "Invalid username And Password"
        });
    }
   
}); 

router.group("/auth", (router) => {     
    router.use('/verification', Authentication.login);
}); 

router.group("/App", (router) => {
    router.use(appVerifyAuthMiddleware);
    router.use('/', appRoutes);
});
 

 

module.exports = router;