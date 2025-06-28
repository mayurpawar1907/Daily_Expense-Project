import jwt from "jsonwebtoken";
import db from "./db.js";

const getDailyExpense = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.error("❌ No token found in request headers");
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, "mayur"); 
        const userId = decoded.id;

        if (!userId) {
            console.error("❌ Token decoded but no user ID found");
            return res.status(403).json({ error: "Invalid token: No user ID" });
        }

        console.log(`✅ Fetching daily expense for user ID: ${userId}`);


        const userCheckQuery = "SELECT id FROM login WHERE id = ?";
        db.query(userCheckQuery, [userId], (err, userResults) => {
            if (err) {
                console.error("❌ Database Error (User Check):", err);
                return res.status(500).json({ error: "Database Query Error" });
            }
            if (userResults.length === 0) {
                console.error("❌ User not found in database");
                return res.status(404).json({ error: "User not found" });
            }

    
            const expenseQuery = `SELECT SUM(amount) AS dailyExpense 
FROM expensedata 
WHERE userId = ? 
AND DATE(date) = DATE(NOW());


`;


            db.query(expenseQuery, [userId], (err, expenseResults) => {
                if (err) {
                    console.error("❌ Database Error (Expense Query):", err);
                    return res.status(500).json({ error: "Database Query Error" });
                }
            
                console.log("🟢 MySQL Query Raw Result:", expenseResults);
            
                if (expenseResults.length > 0) {
                    console.log(`✅ Daily Expense for user ${userId}:`, expenseResults[0].dailyExpense);
                } else {
                    console.log("⚠️ No expenses found for today.");
                }
            
                return res.json({ dailyExpense: expenseResults[0]?.dailyExpense || 0 });
            });
            
        });

    } catch (error) {
        console.error("❌ Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getDailyExpense;
