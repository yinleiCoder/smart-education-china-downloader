const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.json(),
    winston.format.colorize({ all: true })
  ),
  defaultMeta: { service: "smart-education-china-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: "exceptions.log" })],
});

module.exports = logger;
