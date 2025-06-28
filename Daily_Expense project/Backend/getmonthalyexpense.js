import jwt from "jsonwebtoken";
import db from "./db.js";

const getmonthalyExpense = async (req, res) => {
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

        console.log(`✅ Fetching monthly expense for user ID: ${userId}`);

        // Check if user exists
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

            // Query to get the sum of expenses for the current month
            const expenseQuery = `
                SELECT COALESCE(SUM(amount), 0) AS monthlyExpense 
                FROM expensedata 
                WHERE userId = ? AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
            `;

            db.query(expenseQuery, [userId], (err, expenseResults) => {
                if (err) {
                    console.error("❌ Database Error (Expense Query):", err);
                    return res.status(500).json({ error: "Database Query Error" });
                }
            
                console.log("🟢 MySQL Query Raw Result:", expenseResults);
            
                if (expenseResults.length > 0) {
                    console.log(`✅ Monthly Expense for user ${userId}:`, expenseResults[0].monthlyExpense);
                } else {
                    console.log("⚠️ No expenses found for this month.");
                }
            
                return res.json({ monthlyExpense: expenseResults[0]?.monthlyExpense || 0 });
            });
        });

    } catch (error) {
        console.error("❌ Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getmonthalyExpense;
