import db from "./db.js";

const deleteExpense = async (req, res) => {
  const userId = req.user?.id;

  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized: No token" });

  try {
    const sql = "DELETE FROM expensedata WHERE  id = ?";

    db.query(sql, [id, userId], (err, results) => {
      if (err) {
        console.error(" Database Error:", err);
        return res.status(500).json({ error: "Database Error" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Expense not found or unauthorized" });
      }

      return res.json({ message: "Expense deleted successfully!" });
    });
  } catch (error) {
    console.error(" Invalid Token:", error);
    return res.status(403).json({ error: "Invalid Token" });
  }
};

export default deleteExpense;
