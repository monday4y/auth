const mongoose =require('mongoose');
const user_Schema=new mongoose.Schema({
   email:{ type:String,unique:true,required:true},
    password:{ type:String,required:true},
    refresh_token:{ type:String},
},{timestamps:true});

module.exports=mongoose.model("User",user_Schema);