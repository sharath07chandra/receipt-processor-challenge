const winston = require('winston');

// Define the format for the log messages
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// Create a logger instance with console transport
const logger = winston.createLogger({
    level: 'info', // Set the logging level
    format: logFormat,
    transports: [
        new winston.transports.Console() // Log to console
    ]
});

// Log errors
const logError = (message, error) => {
    logger.error(`${message}: ${error.stack || error}`);
};

// Log info
const logInfo = (message) => {
    logger.info(message);
};

module.exports = { logError, logInfo };
