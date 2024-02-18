import express from 'express'
import { createMember, loginMember } from '../controller/userController.mjs';

const userRouter= express.Router();
userRouter.get('/',(req,res)=>{
    return res.send("api workinggggg")
})
userRouter.post('/signIn',createMember)
userRouter.post('/logIn',loginMember)

export default userRouter;