const asyncHandler=require('express-async-handler');
const bcrypt=require('bcrypt');
const userDB=require('../models/userModel');
const jwt=require('jsonwebtoken');
exports.register=asyncHandler(async(req,res)=>{
    const {Admin,name,email,password}=req.body;
    const dat=await userDB.findOne({email});
    if(dat){
        res.status(400);throw new Error("This email is already registered");
    }
    const hash=await bcrypt.hash(password,10);
    const data=await userDB.create({Admin,name,email,password:hash}   );
    if(data){
    res.status(200).json({data});}
    else{
        res.status(404);throw new Error("Something went wrong the fields");
    }
});
exports.login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        res.status(400);throw new Error("All fields require");
    }
    const user=await userDB.findOne({email});
    console.log(user);
    if(user&&(await bcrypt.compare(password,user.password))){
        const token= jwt.sign({
            user:{
                id:user._id,
                email:user.email,
                name:user.name
            }
        },process.env.ACCESS_TOKEN,{expiresIn:"30m"});
        res.cookie("jwt",token,{
            expires:new  Date(Date.now()+(30*24*60*60*1000)),
            httpOnly:true,
            sameSite: 'none',
            secure: true, 
        });
        res.cookie("id",user._id,{
            sameSite: 'none',
  secure: true, 
        });
        res.status(200).json({
            id:user._id,
        });
    }
    else{
        res.status(404);throw new Error("Invalide email and password");
    }
})
exports.logOut=asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        expires:new Date(0),
        httpOnly:true
    });
    res.cookie("id",undefined,{
        path:"/",
    });
    console.log("remove the cookie");
    res.send("done");
});
exports.check=asyncHandler(async(req,res)=>{
    
        console.log(req.cookies);
        const token=req.cookies.jwt;
        const data=await userDB.findById(req.cookies.id);
            console.log("jwt",token,data);
            if(!token){res.send(false);return;}
            jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
                if(err){
                    res.send(false);return ;
                }else{
                    res.status(200).json(data);
                }});
           
});
