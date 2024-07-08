const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info/info.log' }),
  ],
});

module.exports = logger;
