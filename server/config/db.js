import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
        console.log("mongodb connected");
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

export default connectDB;