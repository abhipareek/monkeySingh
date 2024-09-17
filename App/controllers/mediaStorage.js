let Validator = require('validatorjs'); 
const BlogSchema = require('./validation-schemas/blogSchema'); 
var ImageKit = require("imagekit");
let appConfig = require('../config/appConfig');  


exports.mediaStorage = async (req, res) => {
    let rules = BlogSchema.mediaStorage;
    var request = req.body; 
    let files = req?.files;
let getRes='';
    if (files) {
        files = files['file'];
        if (files.mimetype == 'video/mp4' || files.mimetype == 'image/jpeg' || files.mimetype == 'image/png') {
            files.name = Date.now() + '_' + files.name
            const filePath = `/root/apps/Monkeysingh-Production/public/cdn/${files.name}`;
            files.mv(filePath, err => {
                if (err) {
                    return res.json({
                        code: 400,
                        message: err
                    });

                    
                }
                getRes =`https://www.monkeysingh.com/static/cdn/${files.name}`;
                   
               
                return res.json({
                    code: 200,
                    data: getRes,
                    
                });


            });
        } else {
            return res.json({
                code: 400,
                message: "Please upload valid .png , .mp4, JPEG files ",
            });
        }
    } else {
        return res.json({
            code: 400,
            message: "Please upload valid file",
        });
    }


      
  
}
exports.mediaStorag_ = async (req, res) => {
    let rules = BlogSchema.mediaStorage;
    var request = req.body;
    // let validation = new Validator(request, rules);

    // if (!validation.passes()) {
    //     var errors = validation.errors.all();
    //     return res.json({ code: 400, errors: errors });
    // }
    let url="";
    if(req.files.file){
        let files=req.files;
        let mainImage=files.file;
        let file_name = mainImage.name;
 
    

    var imagekit = new ImageKit({
        publicKey :appConfig.IK_PUBLIC_KEY,
        privateKey : appConfig.IK_PRIVATE_KEY,
        urlEndpoint :appConfig.IK_URL
    });
    var buffer = new Buffer.from(mainImage?.data, 'base64');
    //var buffer = new Buffer.from(mainImage?.data.toString(), 'base64');  
  await  imagekit.upload({
        file :  buffer, //files, //required
        fileName : mainImage?.name , //"my_file_name.jpg",   //required
        folder: 'monkeysingh',
        extensions: [
            {
                name: "google-auto-tagging",
                maxTags: 5,
                minConfidence: 95
            }
        ]
    }).then(response => {
        if(response?.url){
            url = response?.url
        }

        return res.json({
            code: 200,
            data: url,
            
        });
        
    }).catch(error => {
        console.log(error);
        return res.json({
            code: 400,
            data: error?.message,
            
        });
    });
  
     
}
      
  
}