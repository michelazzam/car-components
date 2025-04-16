import mongoose from "mongoose";

export const connectToDB = function connectToDB(callBack: () => void) {
  // Default to local MongoDB if DATABASE_URL is not provided
  const databaseUrl = process.env.DATABASE_URL || ""; // Default to a local database

  mongoose
    .connect(databaseUrl, {})
    .then(() => {
      console.log(`Connected to database: ${databaseUrl}`);
      callBack();
    })
    .catch((error) => {
      console.error("Failed to connect to database", error);
      throw error;
    });
};

export const disconnectFromDB = async function closeConnection() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Failed to disconnect from the database", error);
    throw error;
  }
};
