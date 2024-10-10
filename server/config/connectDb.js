import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Connected", con.connection.host);  
    } catch (err) {
        console.log("Error", err.message);
        process.exit(1)
    }
} 