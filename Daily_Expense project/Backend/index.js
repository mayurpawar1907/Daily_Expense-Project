import express from "express";
import cors from "cors";

import getSignupData from "./getSignupdata.js";

import addExpensedData from "./AddExpense.js";

import  updateExpense from './updateExpenseData.js'

import dotenv from "dotenv";
import signup from "./SignupData.js";

import cookieParser from "cookie-parser";
import authMiddleware from "./authMiddleWear.js";
import getLogiData from "./getLoginData.js";
// import { logOut } from "./getLoginData.js";
import getUserExpense from "./getExpenseData.js";
import getsignupdata from "./getSignupdata.js";
import getDailyexpense from "./getDailyExpense.js";
import deleteExpense from "./deleteExpense.js";
import  getmonthalyExpense from "./getmonthalyexpense.js"
import updateprofile from "./updateProfil.js";
import authMiddleWear from "./authMiddleWear.js";
import getDailyExpense from "./getDailyExpense.js";
import getgraphexpense from "./graphExpense.js";
import getAllExpense from "./getAllExpense.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    
  })
);


app.use(cookieParser());

app.post("/signup", signup);
app.post("/addExpense", addExpensedData);
app.get("/getExpense", authMiddleware, getUserExpense);

app.get("/getsignupdata", getsignupdata);

app.put("/updateExpense/:id", authMiddleware, updateExpense);

app.post("/login", getLogiData);
// app.post("/logout",logOut)
app.get("/getDailyexpense",getDailyexpense)
app.delete("/deleteExpense/:id",authMiddleware,deleteExpense)
app.get("/getMonthlyExpense",authMiddleware,getmonthalyExpense)
app.put("/upprofile",authMiddleware,updateprofile)
app.get("/getDailyExpense",authMiddleWear,getDailyExpense)
app.get("/graphexp",getgraphexpense)
app.get("/getall",getAllExpense)

app.listen(3000, () => {
  console.log("Server is running");
});
