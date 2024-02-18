import Joi from "joi";
import Member, { JOilogIn, joiUserSchema } from "../model/member.Model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createMember = async(req, res) => {
  try {
    const { error, value } = joiUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
   value.email=value.email.toLowerCase();
    const checkmember= await Member.findOne({email:value.email});
    if(checkmember){
      return res.status(400).json({ message: "Email already exists" });
    }

 const hassedpassword = await bcrypt.hash(value.password, 10);
 value.password=hassedpassword;

  const newmember= await Member.create(value);
return res.status(201).json({message:"User created successfully",data:newmember});

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const loginMember = async(req, res) => {
    try {
        const { email, password } = req.body;
   const {error,value}= JOilogIn.validate(req.body);
   if(error){
    return res.status(400).json({ message: error.message });
   }
   

   const userLogin= await Member.findOne({email:email.toLowerCase()});
   if(!userLogin){
    return res.status(400).json({ message: "user not exist" });
   }

   bcrypt.compare(password, userLogin.password, (err, result) => {
 if(err){
    return res.status(404).json({
        message: "wrong password",
    })
 }

   });
const {jwtSecret,jwtex}=process.env;
   const token= jwt.sign({id:userLogin._id},jwtSecret,{
    expiresIn:jwtex
   })
res.setHeader('x-api-token',token);
return res.status(200).json({message:"login successfully"});


    } catch (err) {
       return res.status(500).json({ message: err.message }); 
    }
}