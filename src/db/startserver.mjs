import mongoose from "mongoose";

export const startServer=async(app,port,uri)=>{
    try {
        const db= await mongoose.connect(uri);
        console.log("Database connected");
        app.listen(port, ()=>{
            console.log("connected to the port " + port);
        });
    } catch (error) {
        console.log(error);
    }
};