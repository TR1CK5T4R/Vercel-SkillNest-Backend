import dotenv from "dotenv";
import connectDB from "../db/index.js";
import app from "../app.js";

dotenv.config({ path: "./.env" });

let isConnected = false;

// Connect to DB only once (serverless optimization)
async function ensureDbConnection() {
    if (isConnected) {
        return;
    }

    try {
        await connectDB();
        isConnected = true;
    } catch (err) {
        console.log("Error in mongoDB connection:", err);
        throw err;
    }
}

// Serverless function handler
export default async function handler(req, res) {
    await ensureDbConnection();
    return app(req, res);
}