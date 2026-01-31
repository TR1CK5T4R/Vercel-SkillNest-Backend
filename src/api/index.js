import dotenv from "dotenv";
import connectDB from "../db/index.js";
import app from "../app.js";

dotenv.config({ path: "./.env" });

let isConnected = false;

async function ensureDbConnection() {
    if (isConnected) {
        return;
    }

    try {
        await connectDB();
        isConnected = true;
        console.log("✅ Database connected in serverless function");
    } catch (err) {
        console.log("❌ Error in mongoDB connection:", err);
        throw err;
    }
}

// Export the handler that Vercel expects
export default async function handler(req, res) {
    try {
        await ensureDbConnection();

        // Pass the request to your Express app
        return app(req, res);
    } catch (error) {
        console.error("Handler error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}