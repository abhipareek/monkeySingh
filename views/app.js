/*
==========================================
INSTALLING THE PACKAGES
==========================================
*/

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const forEachAsync = require('foreachasync').forEachAsync;
const nodemailer = require("nodemailer")
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const User = require("./models/user");
const Project = require("./models/project");
const ContactQuery = require("./models/contactQuery");
const ScheduleCallQuery = require("./models/scheduleCallQuery");
const OneFreeCreativeQuery = require("./models/oneFreeCreativeQuery");
const WatchDemo = require("./models/watchdemo");
const Blog = require("./models/blog");
const Testimonial = require("./models/testimonial");
const Work = require("./models/work");
const Story = require("./models/story")
const cors = require("cors");
const Razorpay = require("razorpay");
const WorkCategory = require("./models/workCategory");
const path = require('path');
const { Attachment } = require("@sendgrid/helpers/classes");
const { response } = require("express");
const { rmSync } = require("fs");
require('dotenv').config()
const YOUR_DOMAIN = "https://wwww.monkeysingh.com";
const plans = {
  // monthly
  StarterMonthly: process.env.RZP_PLAN_STARTER_MONTHLY,
  BasicMonthly: process.env.RZP_PLAN_BASIC_MONTHLY,
  PlusMonthly: process.env.RZP_PLAN_PLUS_MONTHLY,
  // quarterly
  StarterQuarterly: process.env.RZP_PLAN_STARTER_QUARTERLY,
  BasicQuarterly: process.env.RZP_PLAN_BASIC_QUARTERLY,
  PlusQuarterly: process.env.RZP_PLAN_PLUS_QUARTERLY,
  // yearly
  StarterYearly: process.env.RZP_PLAN_STARTER_YEARLY,
  BasicYearly: process.env.RZP_PLAN_BASIC_YEARLY,
  PlusYearly: process.env.RZP_PLAN_PLUS_YEARLY,
};
let WorkCategoryArray = [
  'App-Development', 'Banner',
  'Books', 'Card',
  'Digital-Ads', 'Logo',
  'Newspaper-Ad', 'Packaging',
  'Promotional', 'Social-Media',
  'T-Shirt', 'Typography',
  'Web-Design', 'Motion-Video'
]
const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });

  return transporter;
};
const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};


const instance = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});
/*
==========================================
CONFIGURATIONS
==========================================
*/
const PORT = process.env.PORT || 3000;
// mongoose.connect(process.env.MONGO_CONN_STRING, (err) => {
//   if (err) console.log(err);
//   else console.log("connected");});
mongoose.connect(process.env.MONGO_CONN_STRING, { useUnifiedTopology: true, useNewUrlParser: true }).
  then(() => console.log('Connected')).
  catch(err => console.log('Caught', err.stack));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(methodOverride("_method"));
app.use(cookieParser("secret"));
//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Monkey singh is best graphic designer",
  resave: false,
  saveUninitialized: false,
})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.listen(PORT, function () {
  console.log(`Server Started at port ${PORT}`);
});
const tempdetails = { email: "", username: "", firstName: "", lastName: "", password: "", otp: "" }


/*
==========================================
ROUTES
==========================================
*/

app.get("/", function (req, res) {
  Work.find({}, (err, workArray) => {
    shuffle(workArray);
    if (err) console.log(err);
    else {
      Testimonial.find({}, (err, testimonialArray) => {
        if (err) console.log(err);
        else {
          Story.find({}, (err, storyArray) => {
            if (storyArray.length > 4)
              var videoArray = [storyArray[0].videoURL, storyArray[1].videoURL, storyArray[2].videoURL, storyArray[3].videoURL];
            else
              var videoArray = []
            res.render("home", {
              workArray: workArray,
              testimonialArray: testimonialArray,
              plans: plans,
              videoArray: videoArray,
            });
          })
        }
      });
    }
  });
});
app.get("/how-it-works", (req, res) => {
  res.render("howitworks");
});
app.get("/watch-demo", (req, res) => {
  res.render("watchdemo")
})
app.get("/pricing", (req, res) => {
  res.render("pricing", { plans: plans });
});
app.get("/dashboard", isLoggedIn, async function (req, res) {
  // populating its posts and rendering dashboard
  let user = await User.findOne({ email: req.user.email })
  if (!user.subscriptionId) {
    res.render("pricing", { plans: plans })
  }
  else {
    let response = await instance.subscriptions.fetch(user.subscriptionId)
    var currentTimeInUnix = Math.floor(Date.now() / 1000);
    // next renew date current end
    // valid till response.end_at + response.current_end - response.current_start
    user.current_end = response.current_end
    user.validTill = response.end_at + response.current_end - response.current_start;
    user.subscriptionStatus = "active";
    user.currentPlan = findPlanName(response.plan_id)
    await user.save()
    // active subscription
    if (user.current_end > currentTimeInUnix && (response.status == "active" || response.status == "completed")) {
      User.findOne({ email: req.user.email }).populate("projects").exec(function (err, user) {
        if (err) console.log(err);
        else {
          res.render("dashboard", { user: user, WorkCategoryArray: WorkCategoryArray, current_end: unixToDate(user.current_end), validTill: unixToDate(user.validTill) });
        }
      });
    }
    // expired subscription
    else {
      user.currentPlan = "";
      user.subscriptionStatus = "expired"
      await user.save()
      res.render("pricing", { plans: plans })
    }
  }
});
app.post("/project", isLoggedIn, function (req, res) {
  // getting todays date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;

  // get data from form and add to projectList array
  User.findOne({ email: req.user.email }, (err, user) => {
    if (user.subscriptionStatus == "active") {
      Project.create(
        {
          title: req.body.projectTitle,
          category: req.body.category,
          state: "pending",
          date: today,
          url: "",
          user: user.username
        },
        function (err, project) {
          User.findOne({ email: req.user.email }, function (err, foundUser) {
            if (err) console.log(err);
            else {
              foundUser.projects.push(project);
              foundUser.save(function (err, data) {
                if (err) console.log(err);
              });
            }
          });
        }
      );
      res.redirect("/dashboard");
    }
    else {
      res.redirect("/pricing");
    }
  })

});
app.get("/register", function (req, res) {
  var err = {
    message: "",
  };
  res.render("register", { err: err.message });
});
app.post("/register", function (req, res) {
  if (isUserExist(req.body.username, req.body.email) == true) {
    var errmsg = {
      message: "Email or username already exist",
    };
    res.render("register", { err: errmsg.message });
  }
  else {
    tempdetails.username = req.body.username
    tempdetails.firstName = req.body.firstName
    tempdetails.lastName = req.body.lastName
    tempdetails.email = req.body.email
    tempdetails.password = req.body.password
    tempdetails.otp = generateOTP()

    sendEmail({
      from: "Monkeysingh <help@monkeysingh.com>",
      to: req.body.email,
      subject: "OTP for registration is:",
      text: "OTP for account verification is " + tempdetails.otp,
    });

    console.log('Email sent')
    res.render('otpregister', { err: "" });

  }
});
app.post('/resend', function (req, res) {
  sendEmail({
    from: "Monkeysingh <help@monkeysingh.com>",
    to: tempdetails.email,
    subject: "OTP for registration is:",
    text: "OTP for account verification is " + tempdetails.otp,
  });
  console.log('Email sent')
  res.render('otpregister', { err: "otp has been sent" });
});

app.post('/verifyregister', function (req, res) {
  if (req.body.otp == tempdetails.otp) {
    var newUser = new User({
      username: tempdetails.username,
      firstName: tempdetails.firstName,
      lastName: tempdetails.lastName,
      email: tempdetails.email,
      dateRegistered: new Date()
    });
    User.register(newUser, tempdetails.password, function (err, user) {
      if (err) {
        console.log(err);
        return res.render("register", { err: err.message });
      }
      res.render("login")
    });
  }
  else {
    res.render('otpregister', { err: 'otp is incorrect' });
  }
});
app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", { err: "" })
})
app.post("/sendotpforgotpassword", (req, res) => {
  tempdetails.email = req.body.email
  //generate random otp
  tempdetails.otp = generateOTP();
  // send mail with defined transport object
  sendEmail({
    from: "Monkeysingh <help@monkeysingh.com>",
    to: req.body.email,
    subject: "OTP for registration is:",
    text: "OTP for account verification is " + tempdetails.otp
  });
  console.log('Email sent')
  res.render("otpforgotpassword", { err: "" })
})
app.post("/verifyotpforgotpassword", (req, res) => {
  if (req.body.otp == tempdetails.otp) {
    res.render("changepassword")
  }
  else {
    res.render("otpforgotpassword", { err: "Incorrect OTP entered" })
  }
})
app.post("/changepassword", (req, res) => {
  User.findOne({ email: tempdetails.email }, (err, user) => {
    user.setPassword(req.body.password, function (err, user) {
      user.save()
      res.redirect("/dashboard")
    })
  })
})
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/login_err", (req, res) => {
  res.render("login_err");
});
app.post("/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login_err",
  }),
);
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
app.get("/contact-us", (req, res) => {
  res.render("contactus", { isQuerySubmitted: false });
});
app.post("/contactus", (req, res) => {
  var today = currentDate();
  ContactQuery.create(
    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      companyName: req.body.companyName,
      message: req.body.message,
      date: new Date(),
    },
    (err, contactQuery) => {
      if (err) console.log(err);
      else {
        res.render("contactus", { isQuerySubmitted: true });
      }
    }
  );
});
app.post("/watch-demo", (req, res) => {
  var today = currentDate();
  WatchDemo.create(
    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      companyName: req.body.companyName,
      message: req.body.message,
      date: today,
    },
    (err, watchDemo) => {
      if (err) console.log(err);
      else {
        res.render("viewvideodemo");
      }
    }
  );
});
app.get("/features", (req, res) => {
  res.render("features");
});
app.get("/our-work", (req, res) => {
  res.redirect("/our-work/All");
});
app.get("/our-work/:category", (req, res) => {
  var category = req.params.category;
  if (category == "All") {
    Work.find({}, (err, workArray) => {
      if (err) console.log(err);
      else {
        res.render("ourwork", { workArray: workArray, category: "all" });
      }
    });
  } else {
    Work.find({ category: category }, (err, workArray) => {
      if (err) console.log(err);
      else {
        res.render("ourwork", { workArray: workArray, category: category });
      }
    });
  }
});
app.get("/blogs", (req, res) => {
  //find all blogs , make array and render all blogs
  Blog.find({}, async (err, blogPostArray) => {
    if (err) console.log(err);
    else {
      // console.log(blogPostArray)
      blogPostArray.sort(compare).reverse();
      // await forEachAsync(blogPostArray, async(element,key) => {

      //   element.shortDis=element.description;
      // });
      // console.log(blogPostArray);
      res.render("blog", { blogPostArray: blogPostArray });
    }
  });
});
app.post("/create-new-blogpost", (req, res) => {
  // getting todays date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  // creating post
  var newBlog = new Blog({
    author: req.body.author,
    title: req.body.title,
    category: req.body.category,
    image: req.body.image,
    description: req.body.description,
    metaDescription: req.body.metaDescription,
    date: req.body.date,
    urlTitle: req.body.title.replace(/\s+/g, '-').toLowerCase(),
  });
  //save this in blog collection and redirect to all blog page
  newBlog.save((err, blog) => {
    if (err) console.log(err);
    else {
      res.redirect("/blogs");
    }
  });
});
app.post("/create-new-testimonial", (req, res) => {
  // creating testimonial
  var newTestimonial = new Testimonial({
    name: req.body.name,
    designation: req.body.designation,
    image: req.body.image,
    description: req.body.description,
  });
  //save this in testimonial collection and redirect to home page
  newTestimonial.save((err, testimonial) => {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});
app.post("/create-new-work", (req, res) => {
  // creating work
  var newWork = new Work({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    description: req.body.description,
  });
  //save this in testimonial collection and redirect to home page
  newWork.save((err, work) => {
    if (err) console.log(err);
    else {
      res.redirect("/");
    }
  });
});
app.post("/create-new-story", (req, res) => {
  // creating work
  var newStory = new Story({
    videoURL: req.body.videoURL,
    imageURL: req.body.imageURL,
    description: req.body.description,
  });
  //save this in story collection and redirect to home page
  newStory.save((err, story) => {
    if (err) console.log(err);
    else {
      res.redirect("/customer-stories");
    }
  });
});
app.get("/admin", (req, res) => {
  res.render("admin", { status: false, WorkCategoryArray: WorkCategoryArray });
});
app.post("/admin-login", (req, res) => {
  var adminId = "cc1BkAATqxf52oZo2P3q";
  var adminPassword = "ws1WQAMwap4tPJQFEHo0";
  var name = req.body.name;
  var password = req.body.password;
  if (adminId == name && adminPassword == password) {
    res.render("admin", { status: true, WorkCategoryArray: WorkCategoryArray });
  } else {
    res.redirect("/admin");
  }
});
let sub_id;
let selected_plan_id;
let total_count_var;
app.get("/checkout", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.user.email })
  res.render("checkout", { user: user })
})
app.post("/create-checkout-session", isLoggedIn, (req, res) => {
  selected_plan_id = req.body.plan
  res.redirect("/checkout")
})
app.post("/one-time-access", isLoggedIn, (req, res) => {
  if (selected_plan_id == plans.BasicMonthly || selected_plan_id == plans.StarterMonthly || selected_plan_id == plans.PlusMonthly)
    total_count_var = 1;
  if (selected_plan_id == plans.BasicQuarterly || selected_plan_id == plans.StarterQuarterly || selected_plan_id == plans.PlusQuarterly)
    total_count_var = 3;
  if (selected_plan_id == plans.BasicYearly || selected_plan_id == plans.StarterYearly || selected_plan_id == plans.PlusYearly)
    total_count_var = 12;
  const params =
  {
    plan_id: selected_plan_id,
    customer_notify: 1,
    quantity: 1,
    total_count: total_count_var,
  }
  instance.subscriptions.create(params, (err, response) => {
    subscriptionObj = response
    // console.log(response)
    sub_id = response.id;
    // console.log(response)
    res.json(response)
  })
})
app.post("/verify", async (req, res) => {
  let paymentDocument = await instance.payments.fetch(req.body.razorpay_payment_id)
  // console.log(paymentDocument)
  if (paymentDocument.status == "captured" || paymentDocument.status == "authorized") {
    // transaction successful
    // save sub id to user database and payment id to database , and from plan id save plan name to database
    let user = await User.findOne({ email: req.user.email })
    user.subscriptionId = sub_id;
    user.plan_id = selected_plan_id;
    user.created_at = paymentDocument.created_at
    user.save()
    res.redirect("/dashboard")
  }
  else {
    res.send("Waiting for transaction to be successful")
  }
})
app.get("/cancel_subscription", isLoggedIn, (req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    user.subscriptionId = "";
    user.plan_id = "";
    user.currentPlan = "";
    user.current_end = "";
    user.validTill = "";
    user.subscriptionStatus = "cancelled"
    user.save()
    instance.subscriptions.cancel(user.subscriptionId)
    res.redirect("/")
  })
})
app.get("/blogs/:urlTitle",  (req, res) => {
  Blog.findOne({ urlTitle: req.params.urlTitle }, async (err, blogPost) => {
    blogPostArray= await Blog.find({},{},{limit:7}); 
    res.render("blogpage", { blogPost: blogPost, blogPostArray:blogPostArray});
  })
})
app.get("/about-us", (req, res) => {
  res.render("aboutus")
})
app.get("/forgotusername", (req, res) => {
  res.render("forgotusername")
})
app.post("/sendusernameforgotusername", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    sendEmail({
      from: "Monkeysingh <help@monkeysingh.com>",
      to: req.body.email,
      subject: "Username for monkeysingh.com is:",
      text: "Username for email address is " + user.username
    });
    console.log('Email sent')
    res.redirect("/")
  })
})
app.get("/graphic-design-company", (req, res) => {
  res.render("graphicdesigncompany.ejs")
})
app.get("/logo-design", (req, res) => {
  res.render("logodesign.ejs")
})
app.get("/robots.txt", (req, res) => {
  res.sendFile(__dirname + "/public/robots.txt")
})
app.get("/sitemap.xml", (req, res) => {
  res.sendFile(__dirname + "/public/sitemap.xml")
})
app.get("/customer-stories", (req, res) => {
  Story.find({}, (err, storyArray) => {
    res.render("stories", { storyArray: storyArray })
  })
})
app.get("/book-cover-design", (req, res) => {
  res.render("bookcoverdesign")
})
app.get("/website-design", (req, res) => {
  res.render("websitedesigncompany");
})
app.get("/social-media-post-design", (req, res) => {
  res.render("socialmediapostdesign")
})
app.get("/motion-video-maker", (req, res) => {
  res.render("motionvideomaker");
})
app.get("/facebook-banner-design", (req, res) => {
  res.render("facebookbannerdesign")
})
app.get("/packaging-design", (req, res) => {
  res.render("packagingdesign")
})
app.get("/promotional-content-design", (req, res) => {
  res.render("promotionalcontentdesign")
})
app.get("/one-free-creative", (req, res) => {
  res.render("onefreecreative", { msg: "" })
})
let otp = generateOTP();
let person = {
  name: "req.body.name",
  email: "req.body.email",
  phoneNumber: "req.body.phoneNumber",
  companyName: "req.body.companyName",
  message: "req.body.message",
  date: new Date()
}
app.post("/trialformdetails", (req, res) => {
  OneFreeCreativeQuery.find({ $or: [{ phoneNumber: req.body.phoneNumber }, { email: req.body.email }] }, (err, foundQueries) => {
    if (foundQueries.length != 0) {
      res.render("onefreecreative", { msg: "Email or Phone Number already exists." })
    }
    else {
      otp = generateOTP();
      sendEmail({
        from: "Monkeysingh <help@monkeysingh.com>",
        to: req.body.email,
        subject: "OTP for monkeysingh.com is:",
        text: otp,
      });
      console.log('Email sent')
      res.render("onefreecreative", { msg: "An OTP has been sent to your given mail address." })
      person = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        companyName: req.body.companyName,
        message: req.body.message,
        date: new Date(),
      }
    }
  })
});

app.post("/trialformotp", (req, res) => {
  if (req.body.otp == otp) {
    OneFreeCreativeQuery.create(
      person,
      (err, oneFreeCreativeQuery) => {
        if (err) console.log(err);
        else {
          res.render("validsubmission");
        }
      }
    );
  }
  else {
    res.render("onefreecreative", { msg: "Wrong OTP submitted" })
  }
})
app.get("/ecommerce-ads", (req, res) => {
  res.render("ecommerce")
})
app.post("/ecommerce", (req, res) => {
  ScheduleCallQuery.create(
    {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      companyName: req.body.companyName,
      source: req.body.source,
      date: new Date(),
    },
    (err, ScheduleCallQuery) => {
      if (err) console.log(err);
      else {
        res.render("contactus", { isQuerySubmitted: true });
      }
    }
  );
})

function isUserExist(userName, userEmail) {
  User.find({ $or: [{ username: userName }, { email: userEmail }] }, (err, foundUsers) => {
    if (foundUsers.length != 0)
      return true;
    return false;
  }
  );
}
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function findPlanName(plan_id) {
  var planName
  if (plan_id == plans.StarterMonthly)
    planName = "Starter - Monthly"
  if (plan_id == plans.BasicMonthly)
    planName = "Basic - Monthly"
  if (plan_id == plans.PlusMonthly)
    planName = "Plus - Monthly"
  if (plan_id == plans.StarterQuarterly)
    planName = "Starter - Quarterly"
  if (plan_id == plans.BasicQuarterly)
    planName = "Basic - Quarterly"
  if (plan_id == plans.PlusQuarterly)
    planName = "Plus - Quarterly"
  if (plan_id == plans.StarterYearly)
    planName = "Starter - Yearly"
  if (plan_id == plans.BasicYearly)
    planName = "Basic - Yearly"
  if (plan_id == plans.PlusYearly)
    planName = "Plus - Yearly"
  return planName;
}
function isMonthlyPlan(plan_id) {
  if (plan_id == plans.StarterMonthly || plan_id == plans.BasicMonthly || plan_id == plans.PlusMonthly)
    return true;
  return false;
}
function isQuarterlyOrYearlyPlan(plan_id) {
  if (plan_id == plans.StarterQuarterly)
    return true;
  else if (plan_id == plans.BasicQuarterly)
    return true;
  else if (plan_id == plans.PlusQuarterly)
    return true;
  else if (plan_id == plans.StarterYearly)
    return true;
  else if (plan_id == plans.BasicYearly)
    return true;
  else if (plan_id == plans.PlusYearly)
    return true;
  return false;
}
function generateOTP() {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
function unixToDate(unix) {
  let unixMilliSeconds = unix * 1000;
  let dateObject = new Date(unixMilliSeconds)
  let humanDateFormat = dateObject.toLocaleDateString()
  return humanDateFormat;
}
function compare(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}
function currentDate() {
  // getting todays date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  return today;
}