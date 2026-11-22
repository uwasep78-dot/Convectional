const express=require('express');const r=express.Router();const {protect}=require('../middleware/authMiddleware');r.get('/',protect,(req,res)=>res.json({success:true,data:[]}));module.exports=r;
