import jwt from "jsonwebtoken";
const authenticateUser=(req,res,next)=>{
    
    const token=req.headers.authorization?.split(" ")[1];
    if(!token)
        {
            return res.status(401).json({error:"access denied"})
        } 
        try{
            const decoded=jwt.verify(token,"mayur");
            req.user=decoded;
            next()
        } catch(error)
        {
            return res.status(403).json({error:"invalid token"})
        }
}

export default authenticateUser