const mongoose=require('mongoose');

const expSchema=mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userDB'
    },
    name:{
        type:String
    },
    description:{
        type:String
    },
    difficulty:{
        type:Number,
        range:[1,5]
    },
    subject:{
        type:String
    },
    image:{
        type:String
    },
    materials:[String],
    precautions:[String],
    steps:[mongoose.Schema.Types.Mixed],
    views:{
        type:Number,
        default:0
    },
    claps:{
        type:Number,
        default:0
    }
});
module.exports=mongoose.model('expDB',expSchema);