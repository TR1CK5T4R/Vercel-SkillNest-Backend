import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { connect } from "mongoose";
import app from "./app.js";

dotenv.config(
    { path: "./.env" }
);

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("Error in express app:", err);
            throw err;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`\n Server is running on port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("Error in mongoDB connection:", err);
    });
