import db from "./db.js";
import bcrypt from "bcrypt"; 

const updateprofile = async (req, res) => {
    const userId = req.user?.id; 

    if (!userId) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    const { username, email, password } = req.body;

    try {
        let hashedPassword = null;

    
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const sql = `
            UPDATE login 
            SET username = ?, email = ? ${password ? ", password = ?" : ""}
            WHERE id = ?;
        `;

        
        const values = password ? [username, email, hashedPassword, userId] : [username, email, userId];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ message: "Profile updated successfully" });
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export default updateprofile;
