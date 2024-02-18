
import Joi from "joi";
import mongoose, { Schema, model } from "mongoose";

const bookSchema= new Schema({
title:String,
author:String,
memberId:{
    type:Schema.Types.ObjectId,
    ref:"Member"
},
category:String,
subcategory:String,
price:Number,
Isdeleted:{
    type:Boolean,
    default:false,
},
realesedat:Date,
deletedat:Date,
availablebooks:Number
},{
    timeseries: true,
    versionKey: false,
});

const BookModel= model("Book",bookSchema);
export default BookModel;


export const joiBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    price: Joi.number().required(),
  
  availablebooks:Joi.number().required(),
})