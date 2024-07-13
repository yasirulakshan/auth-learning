import dotenv from "dotenv";
dotenv.config();

export default {
  port: 3000,
  dbUri: process.env.MONGO_URI,
  logLevel: "info",
  smtp: {
    user: "p3ghob5rdxkazhjk@ethereal.email",
    pass: "kQzsZvGyMAE7DSxY5s",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
};
