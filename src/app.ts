require("dotenv").config();
import express from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import log from "./utils/logger";
import routes from "./routes";

const app = express();

app.use(express.json());

app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = config.get("port");

app.listen(port, () => {
  log.info(`Server is running at http://localhost:${port}`);

  connectToDb();
});
