import mongoose from "mongoose";

export async function connect() {
    mongoose.connect(process.env.MONGODB_URL as string);
  }