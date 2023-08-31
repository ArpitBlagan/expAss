const expDB= require('../models/experimentModel');
const asyncHandler=require('express-async-handler');

exports.getAllExp=asyncHandler(async(req,res)=>{
    const data=await expDB.find();
    res.status(200).json(data);
})
exports.getOneExp=asyncHandler(async(req,res)=>{
    const valid=await expDB.findById(req.params.id);
    if(valid){
        const data=await expDB.findById(req.params.id).populate({path:'user_id',ref:'userDB'});
        res.status(200).json(data);
    }
    else{
        res.status(404);throw new Error("not found");
    }
})

exports.updateOneExp=asyncHandler(async(req,res)=>{
    const valid=await expDB.findById(req.params.id);
    if(valid){
        const views=req.body.views;
        const claps=req.body.claps;
        console.log(views,claps);
        const ff=await expDB.findByIdAndUpdate(
            {_id:req.params.id},{views},{claps}
        );
        if(!ff){res.status(404);throw new Error("Something went wrong");}
        res.status(202).json(ff);
    }
    else{
        res.status(404);throw new Error("not found");
    }
})
exports.updateContent=asyncHandler(async(req,res)=>{
    const val=await blogsDB.findById(req.params.Id);
    if(!val){
        res.status(404);throw new Error("Not found");
    }
    if(val.user_id.toString()!==req.user.id){
        res.status(404);throw new Error("Invalid access");
    }
    console.log("hitting");
    const ff=await blogsDB.findByIdAndUpdate(
        req.params.id,
        req.body,
    );
    if(!ff){res.status(404);throw new Error("fuck");}
    res.status(202).json(ff);
})