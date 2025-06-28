import db from "./db.js";
import jwt from "jsonwebtoken";

const getGraphExpense = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, "mayur");
        const userId = decoded.id;

        if (!userId) {
            return res.status(403).json({ error: "Invalid token: No user ID" });
        }

        console.log(`✅ Fetching monthly expense for user ID: ${userId}`);

        // Query to get expenses grouped by month for the last 6 months
        const expenseQuery = `
           SELECT 
    MONTHNAME(date) AS month, 
    COALESCE(SUM(amount), 0) AS total_expense
FROM expensedata
WHERE YEAR(date) = YEAR(CURRENT_DATE)
GROUP BY MONTH(date)
ORDER BY MONTH(date);


        `;

        db.query(expenseQuery, [userId], (err, expenseResults) => {
            if (err) {
                console.error("❌ Database Error (Expense Query):", err);
                return res.status(500).json({ error: "Database Query Error" });
            }

            console.log("🟢 MySQL Query Result:", expenseResults);

            return res.json(expenseResults); // Return as an array
        });

    } catch (error) {
        console.error("❌ Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getGraphExpense;
