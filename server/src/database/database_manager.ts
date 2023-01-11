import mongoose from "mongoose";

export let dbConnection: mongoose.Connection;

export async function startDB() {
  try {
    // Avoid deprecation warning and use strictQuery (don't match fields that don't exist)
    mongoose.set("strictQuery", true);
    // Connect to the DB
    await mongoose.connect("mongodb://localhost:27017/cards-project-db");
    dbConnection = mongoose.connection;
  } catch (e) {
    throw new Error(`Connection to MongoDB failed. \n${e}`);
  }
}
