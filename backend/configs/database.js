import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.ATLAS_DB_URL)
      .then(() => console.log("DB Connected"));
  } catch (error) {
    console.log("Error while connecting to DB");
    console.log(error);
  }
};
