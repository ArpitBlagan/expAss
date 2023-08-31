const express=require('express');
const dotenv=require('dotenv').config();
const Router=require('./Router');
const {error}=require('./middleware/error');
const cors=require('cors');
const multer = require('multer');
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser');
mongoose.connect(process.env.URL,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(con=>{console.log("connnected")});
const app=express();
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(cors({
    origin:['*','http://localhost:5173'],
    credentials:true
}))
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use('/exp',Router);
app.use(error);
app.listen(process.env.PORT,()=>{
    console.log(`Server Is Listening on ${process.env.PORT}`);
})