import express from "express";
import jwt from "jsonwebtoken";
import db from "./db.js";

const getsignupdata = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    console.log("🔹 Received Token:", token);

    if (!token) {
        console.log("❌ No token received!");
        return res.status(401).json({ error: "Unauthorized: No token" });
    }

    try {
        const decoded = jwt.verify(token, "mayur"); 
        console.log("✅ Decoded Token:", decoded);

        if (!decoded.id) {
            console.log("❌ Invalid token: No user ID found!");
            return res.status(403).json({ error: "Invalid token: No user ID" });
        }

        const userId = decoded.id;
        console.log("🔹 Extracted User ID:", userId);

        const sql = "SELECT id, username, email FROM login WHERE id = ?"; 
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ error: "Database Error" });
            }

            if (results.length === 0) {
                console.log("❌ No user found!");
                return res.status(404).json({ error: "User not found" });
            }

            console.log("✅ User Data Fetched:", results[0]);
            return res.json(results[0]); 
        });

    } catch (error) {
        console.error("❌ Invalid Token:", error);
        return res.status(403).json({ error: "Invalid Token" });
    }
};

export default getsignupdata;
