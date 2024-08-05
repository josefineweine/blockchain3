import fs from 'fs';
import path from 'path';
import url from 'url';

const __appdir = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));

/**
 *
 * @param {string} filePath 
 * @param {string} logMessage 
 */
const writeLog = (filePath, logMessage) => {
  try {
    fs.appendFileSync(filePath, logMessage);
  } catch (error) {
    console.error(`Failed to write log to ${filePath}:`, error.message);
  }
};

/**
 *
 * @param {string} message 
 * @throws {Error} 
 */
export const handleError = (message) => {
  const filePath = path.join(__appdir, 'logs', 'error.log');
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - Error: ${message}\n`;

  writeLog(filePath, logMessage);

  throw new Error(message);
};

/**
 *
 * @param {Object} err 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const errorHandler = (err, req, res, next) => {
  const filePath = path.join(__appdir, 'logs', 'error.log');
  const timestamp = new Date().toISOString();

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  const logMessage = [
    `${timestamp} - Error Occurred:`,
    `Method: ${req.method}`,
    `URL: ${req.originalUrl}`,
    `Status: ${err.status}`,
    `Success: ${err.success !== undefined ? err.success : false}`,
    `Message: ${err.message}`,
  ].join(' | ') + '\n';

  writeLog(filePath, logMessage);

  res.status(err.statusCode).json({
    success: err.success !== undefined ? err.success : false,
    message: err.message,
  });
};

export default errorHandler;

/**
 *
 * @param {string} message 
 */
export const log = (message) => {
  const filePath = path.join(__appdir, 'logs', 'app.log');
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - Log: ${message}\n`;

  writeLog(filePath, logMessage);
};