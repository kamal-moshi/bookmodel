import jwt from "jsonwebtoken";


export const auth=(req,res,next)=>{
    try {
        const header= req.headers['x-api-token'];
        const {jwtSecret}=process.env;
        if(!header){
            return res.status(400).json({
                message:'invalid token'
            })
        }

jwt.verify(header, jwtSecret, (err, decodedtoken)=>{
if(err){
    return res.status(400).json({
        message:'invalid token'
    })
}
else{
    req.decodedtoken=decodedtoken;
    req.userId= decodedtoken.id;
    console.log(decodedtoken)
   next()
}
})
    } catch (err) {
    return res.status(500).json({message: err.message})    
    }
}