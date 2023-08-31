exports.error=(err,req,res,next)=>{
    console.log(err);
    res.status(res.statusCode).json({
        message:err.message
    });
    next();
}