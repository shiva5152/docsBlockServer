import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error("MONGO_URL is not defined in the environment.");
      }
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log(error);
  }
};


export default connectMongoDB;