import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,)

        console.log("\n Connected to mongodb, DB Host:", connectionInstance.connection.host);
        // console.log(connectionInstance);
    }
    catch (err) {
        console.log("Error connecting to mongodb:", err);
        process.exit(1);
    }
}

export default connectDB;
