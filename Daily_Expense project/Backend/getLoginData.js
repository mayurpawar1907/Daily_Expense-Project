import db from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getLogiData = (req, res) => {
  const { email, password } = req.body;
  console.log("🔹 Received Login Request:", { email });

  const sql = "SELECT id, email, password FROM login WHERE email = ?";
  
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      console.log("⚠️ User Not Found for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];
    console.log("✅ User Found:", user.email);

    try {
      console.log("🔹 Entered Password:", password);
      console.log("🔹 Hashed Password from DB:", user.password);

      
      if (!user.password.startsWith("$2b$")) {
        console.log("⚠️ ERROR: Password in DB is not hashed!");
        return res.status(500).json({ error: "Server error, please reset password" });
      }

    
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("🔹 Password Match Result:", isMatch);

      if (!isMatch) {
        console.log("❌ Passwords do not match!");
        return res.status(401).json({ error: "Invalid email or password" });
      }

  
      const token = jwt.sign({ id: user.id, email: user.email }, "mayur", { expiresIn: "1d" });
      console.log("✅ Token Generated Successfully");

      res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
      return res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("❌ Server Error:", error.message);
      return res.status(500).json({ error: "Server error" });
    }
  });
};

export default getLogiData;
