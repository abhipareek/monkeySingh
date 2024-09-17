let express = require("express");
let router = express.Router();
require("express-group-routes"); 

router.get("/", function (req, res) {
  res.json({
    status: true,
    message: "Welcome to World Of Monketys App APIs",
  });
});
 
router.group("/customer", (router) => {
  var CustomerController = require('../controllers/Customer');
  router.route('/get').post(CustomerController.getList);
  router.route('/getsupportRickets').post(CustomerController.supportRickets);
  router.route('/getwatchdemos').post(CustomerController.watchdemos);
  router.route('/getonefreecreative').post(CustomerController.onefreecreative);
  router.route('/getschedulecall').post(CustomerController.schedulecallqueries);
  router.route('/getprojects').post(CustomerController.projects);

 
});

 

router.group("/blog", (router) => {
  var blogController = require('../controllers/blog');
  router.route('/create').post(blogController.createBlog); 
  router.route('/getBlogById').post(blogController.getBlogById); 
  router.route('/getBlogs').post(blogController.getBlogs); 
  router.route('/editBlog').post(blogController.editBlog); 
  router.route('/deleteblog').post(blogController.deleteblog); 
});

router.group("/story", (router) => {
  var storyController = require('../controllers/story');
  router.route('/create').post(storyController.createstory); 
  router.route('/getstoryById').post(storyController.getstoryById); 
  router.route('/getstorys').post(storyController.getstorys); 
  router.route('/editstory').post(storyController.editstory); 
  router.route('/deletestory').post(storyController.deletestory); 
});

router.group("/testimonial", (router) => {
  var testimonialController = require('../controllers/testimonial');
  router.route('/create').post(testimonialController.createtestimonial); 
  router.route('/gettestimonialById').post(testimonialController.gettestimonialById); 
  router.route('/gettestimonials').post(testimonialController.gettestimonials); 
  router.route('/edittestimonial').post(testimonialController.edittestimonial); 
  router.route('/deletetestimonial').post(testimonialController.deletetestimonial); 
});

router.group("/portfolio", (router) => {
  var portfolioController = require('../controllers/portfolio');
  router.route('/create').post(portfolioController.createportfolio); 
  router.route('/getportfolioById').post(portfolioController.getportfolioById); 
  router.route('/getportfolios').post(portfolioController.getportfolios); 
  router.route('/editportfolio').post(portfolioController.editportfolio); 
  router.route('/deleteportfolio').post(portfolioController.deleteportfolio); 
});

router.group("/media", (router) => {
  var blogController = require('../controllers/mediaStorage');
  router.route('/storage').post(blogController.mediaStorage); 
});
 
module.exports = router;
