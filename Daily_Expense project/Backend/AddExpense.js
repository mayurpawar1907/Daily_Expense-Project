import db from "./db.js";
import jwt from "jsonwebtoken";

const addExpensedData = (req, res) => {
    console.log("Incoming request to /addExpense"); // ✅ Debugging log

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.log("🚨 No token provided!");
        return res.status(401).json({ error: "Unauthorized token" });
    }

    try {
        console.log("🔍 Verifying token...");
        const decoded = jwt.verify(token, "mayur"); // ✅ Ensure correct JWT verification
        console.log("✅ Token verified:", decoded);

        const userId = decoded.id;
        const { item, amount, expense_by, date, payment_type, priority } = req.body;

        console.log("📌 Received expense data:", { item, amount, expense_by, date, payment_type, priority, userId });

        // ✅ SQL SYNTAX FIXED!
         const sql = "INSERT INTO expenseData (item, amount, expenseby, date, paymenttype, priority,userId) VALUES (?, ?, ?, ?, ?, ?,?)";


        db.query(sql, [item, amount, expense_by, date, payment_type, priority, userId], (err, result) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ error: err.message });
            }
            console.log("✅ Expense added successfully, ID:", result.insertId);
            return res.json({ message: "Expense added successfully", id: result.insertId });
        });

    } catch (error) {
        console.error("🚨 Token verification error:", error);
        return res.status(401).json({ error: "Invalid token. Please log in again." });
    }
};

export default addExpensedData;
