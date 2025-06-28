import express from "express";
import jwt from "jsonwebtoken";
import db from "./db.js";

const getUserExpense = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; 

    console.log("🔹 Received Token:", token); 

    if (!token) return res.status(401).json({ error: "Unauthorized: No token" });

    try {
        const decoded = jwt.verify(token, "mayur"); 
        console.log("✅ Decoded Token:", decoded); 


        const userId = decoded.id;
      
        

        console.log("test",userId);
        
        if (!userId) return res.status(403).json({ error: "Invalid token: No user ID" });

        console.log("🔹 User ID from Token:", userId);

    
        const sql = "SELECT expensedata.* FROM expensedata JOIN login ON expensedata.expenseby = login.email WHERE login.id = ?  ORDER BY id DESC      LIMIT 5   ";

        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ error: "Database Error" });
            }

            console.log("✅ User Expenses:", results); 
            return res.json(results);
        });
    } catch (error) {
        console.error("❌ Invalid Token:", error);
        return res.status(403).json({ error: "Invalid Token" });
    }
};


export default getUserExpense;
