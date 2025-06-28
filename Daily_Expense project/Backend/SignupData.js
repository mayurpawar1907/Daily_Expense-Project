import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db.js";

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log("🔹 Signup Request Received:", { username, email });

  
    const checkUserSql = "SELECT email FROM login WHERE email = ?";
    db.query(checkUserSql, [email], async (err, results) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        console.log("⚠️ User Already Exists:", email);
        return res.status(400).json({ error: "User already exists" });
      }


      const hashedPassword = await bcrypt.hash(password, 10);

      
      const insertSql =
        "INSERT INTO login (username, email, password) VALUES (?, ?, ?)";
      db.query(insertSql, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("❌ Database Insert Error:", err);
          return res.status(500).json({ error: "Failed to register user" });
        }

        console.log("✅ User Registered with ID:", result.insertId);

    
        const token = jwt.sign(
          { id: result.insertId, email },
          "mayur", 
          { expiresIn: "1d" }
        );

        return res.status(201).json({
          message: "Signup successful",
          token,
          user: { id: result.insertId, username, email },
        });
      });
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export default signup;
