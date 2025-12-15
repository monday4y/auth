const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
       await mongoose.connect("your_string");
      console.log("MongoDB Connected")
    }
    catch(error){
        console.log(error);
    }
};
module.exports=connectDB;
