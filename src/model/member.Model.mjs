import Joi from "joi";
import { Schema,model } from "mongoose";


const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  email: {type:String, required: true, lowercase: true,trim:true},
  password: String,
  address: String,
  city:String,
  pincode:String,
},{
    timestamps:true,
    versionKey:false,
});

const Member =  model("Member", memberSchema);

export default Member;




export const joiUserSchema= Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
    address: Joi.string(),
    city: Joi.string(),
    pincode: Joi.string(),
})

export const JOilogIn= Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
})