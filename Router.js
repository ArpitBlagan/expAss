const express=require('express');
const path=require('path');
const expDB =require('./models/experimentModel')
const jwt=require('jsonwebtoken');
const {register,login, logOut,check}=require('./controllers/user');
const {getAllExp,getOneExp,updateOneExp}=require('./controllers/exp');
const Router=express.Router();
Router.route('/register').post(register);
Router.route('/login').post(login);
Router.route('/logout').get(logOut);
Router.route('/all').get(getAllExp);
Router.route('/loggedIn').get(check);
//validate next routes
const multer=require('multer');
const { rmSync } = require('fs');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        
        return cb(null,"uploads/")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueSuffix + fileExtension);
    },
  });
const upload = multer({ storage });
Router.post('/add',upload.fields([{name:'image'},{name:'images',maxCount: 100}]),async(req,res)=>{
    const {user_id,name,description,precautions,difficulty,subject}=req.body;
    console.log(name,description,precautions,difficulty,subject)
    const image=req.files['image'][0].filename;
    console.log(image);
    const materials=JSON.stringify(req.body.materials);
    console.log(materials);
    const ff=req.files['images'];
    const kk=req.body.descriptions;
    const steps=ff.map((ele,index)=>({image:ele.filename,description:kk[index]}));
    console.log(steps);
    const data=await expDB.create({user_id,name,description,subject,image,precautions,materials,steps,difficulty});
    if(data){
        console.log(data);
        res.status(202).json({
            message:"created"
        });
    }
    else{
        console.log("fuck")
        res.status(404);throw new Error("Something went wrong the fields");
    }
});
Router.route('/all/:id').get(getOneExp);
Router.route('/addOther/:id').put(updateOneExp);
module.exports=Router;