import mongoose from "mongoose";

let isConnected = false; 

const connectDB = async () => {
    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
            serverSelectionTimeoutMS: 50000, 
            connectTimeoutMS: 50000
        });

        isConnected = conn.connections[0].readyState;
        console.log("MongoDB connected:", conn.connection.host);
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

export default connectDB;
