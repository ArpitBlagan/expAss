const asyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');
exports.validate=asyncHandler(async(req,res,next)=>{
    //using the cookie that we send while user login in our app
    const token=req.cookies.jwt;
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
            if(err){
                res.status(200).json({
                    message:"TokenExpired"
                });return ;
            }else{
            req.user=decoded.user;
            }next();});
});