
import db from "./db.js";
const updateExpense = (req, res) => {


  const userId = req.user?.id;
  if (!userId) {
      return res.status(401).json({ error: "Unauthorized access: User ID not found" });
  }

  const { id } = req.params;
  if (!id) {
      return res.status(400).json({ error: "Expense ID is required" });
  }

  const { item, amount, expenseby, date, paymenttype, priority } = req.body;

  const sql = `
      UPDATE expensedata 
      SET item = ?, amount = ?, expenseby = ?, date = ?, paymenttype = ?, priority = ? 
      WHERE id=?`;

  const values = [item, amount, expenseby, date, paymenttype, priority, id, userId];

  db.query(sql, values, (err, result) => {
    

      res.status(200).json({ message: " updated successfully" });
  });
};
export default updateExpense
