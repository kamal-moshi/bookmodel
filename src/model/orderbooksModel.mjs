
import { Schema, model } from "mongoose";


export const orderBookSchema= new Schema({
    bookId:{
        type:Schema.Types.ObjectId,
        ref:'Book',
        required: true
    },
    memberId:{
        type:Schema.Types.ObjectId,
        ref:"Member",  
        required: true
    
    },
    bookedAt:Date,
    enddate:Date,
    bookingStatus:{
        type:String,
        enum:["checkout", 'return']
    },
    returnAt:Date,
    charge:Number,
    overdue:Number
},{timestamps:true});

const Order=  model('Order', orderBookSchema);
export default Order;