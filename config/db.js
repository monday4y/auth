const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
       await mongoose.connect("mongodb+srv://priyanshukestwal67_db_user:Rv0G8lvfROieBGuC@cluster0.xt1qarx.mongodb.net/?appName=Cluster0");
      console.log("MongoDB Connected")
    }
    catch(error){
        console.log(error);
    }
};
module.exports=connectDB;