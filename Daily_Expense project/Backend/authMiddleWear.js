import jwt from "jsonwebtoken";

const authMiddleWear = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, "mayur", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }

        console.log("Decoded JWT:", decoded); 
        req.user = decoded;
        next();
    });
};

export default authMiddleWear;
