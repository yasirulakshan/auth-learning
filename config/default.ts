import dotenv from "dotenv";
dotenv.config();

export default {
  port: 3000,
  dbUri: process.env.MONGO_URI,
  logLevel: "info",
};
