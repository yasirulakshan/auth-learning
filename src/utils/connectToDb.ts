import mongoose from "mongoose";
import config from "config";
import log from "./logger";

async function connectToDb() {
  const dbUri = config.get("dbUri") as string;
  try {
    await mongoose.connect(dbUri);
    log.info("Connected to the database");
  } catch (error) {
    log.error("Error connecting to the database: ", error);
    process.exit(1);
  }
}

export default connectToDb;
