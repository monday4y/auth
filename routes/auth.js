const express=require("express");
const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt = require("jsonwebtoken");


const router  = express.Router();

router.post("/register",async(req,res)=>{
    const {email,password} = req.body;
    const userExist=await User.findOne({email});
    if(userExist){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await User.create({
        email,
        password:hashedPassword
    });
    res.status(201).json({message:"User successfully registered"});
});

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user=await User.findOne({email});
    if (!user){
        return res.status(401).json({message:"invalid credential"});
    }
    const match= await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(401).json({message:"invalid credential"});
    }

    const access=jwt.sign({userId:user._id},
        process.env.ACCESS_TOKEN,
        {expiresIn: "1m"});

    const refresh=jwt.sign({userId:user._id},
        process.env.REFRESH_TOKEN,
        {
                expiresIn: "7d"
        });

    user.refresh=refresh;
    await user.save();
    res.json({access,refresh});



});

router.post("/refresh-token",async(req,res)=>{
    const {refresh}=req.body;
    if(!refresh){
        return res.status(401).json({message:"token required"});
    }
    try{
        const payload=jwt.verify(refresh,process.env.REFRESH_TOKEN);
        const user=await User.findOne({
            _id:payload.userId,
            refresh
        });
        if(!user){
            return res.status(403).json({message:"invalid refresh"});
        }
        const newAccess=jwt.sign({
            userID:user._id},
            process.env.ACCESS_TOKEN,
            {expiresIn: "1m"});
        res.json({access:newAccess});
    }

     catch(error){
        res.status(403).json({message:" refresh token expired"});
     }
});

module.exports = router;

