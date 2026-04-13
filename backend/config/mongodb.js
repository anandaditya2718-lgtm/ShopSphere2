import mongoose from "mongoose";

const connectDB = async () => {
    const baseUri = (process.env.MONGODB_URI || "").trim();

    if (!baseUri) {
        console.error("MONGODB_URI is missing in backend/.env");
        return;
    }

    mongoose.connection.on('connected', () => {
        console.log("DB Connected");
    });

    const connectWithRetry = async () => {
        try {
            await mongoose.connect(`${baseUri}/ecommerce`, {
                serverSelectionTimeoutMS: 10000,
            });
        } catch (error) {
            console.error("MongoDB connection failed. Check Atlas IP whitelist or network access.");
            console.error(`Reason: ${error.message}`);
            setTimeout(connectWithRetry, 10000);
        }
    };

    await connectWithRetry();

}

export default connectDB;