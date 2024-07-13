import logger from "pino";
import dayjs from "dayjs";
import config from "config";

const level = config.get("logLevel") as string;

const log = logger({
  transport: {
    target: "pino-pretty",
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
