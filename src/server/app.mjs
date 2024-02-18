import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bookingRouter from "../routes/bookingRoutes.mjs";
import userRouter from "../routes/memberRoutes.mjs";
const app= express()

app.use(cors())
app.use(multer().any())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/user',userRouter);
app.use('/book',bookingRouter)



export default app;
