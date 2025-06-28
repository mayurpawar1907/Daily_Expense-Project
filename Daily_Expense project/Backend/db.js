import mysql from "mysql2"


const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "daily_expense"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL Connection Failed:", err);
        return;
    }
    console.log("Connected to MySQL Server");
});




export default db
