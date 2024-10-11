import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI_PRODUCTION);
        console.log("Mongo Connected", con.connection.host);  
    } catch (err) {
        throw new Error(err.message);
    }
} 