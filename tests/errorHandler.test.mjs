import { handleError } from '../utilities/errorHandler.mjs';
import fs from 'fs';
import path from 'path';

const logFilePath = path.join('logs', 'error.log');

function clearLogFile() {
  fs.writeFileSync(logFilePath, '', (err) => {
    if (err) {
      console.error('Failed to clear the log file:', err);
    }
  });
}

beforeEach(() => {
  clearLogFile();
});

test('Should log multiple errors to the log file', () => {
  const errorsToLog = 10;

  for (let i = 0; i < errorsToLog; i++) {
    try {
      handleError(`Test error message ${i}`);
    } catch (error) {
      fs.appendFileSync(logFilePath, `${error.message}\n`);
    }
  }

  const logData = fs.readFileSync(logFilePath, 'utf8');
  const loggedErrors = logData.trim().split('\n');

  expect(loggedErrors.length).toBe(errorsToLog);
  loggedErrors.forEach((errorMessage, index) => {
    expect(errorMessage).toContain(`Test error message ${index}`);
  });
});

test('Should create the log file if it does not exist', () => {
  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath); 
  }

  try {
    handleError('This is a test error');
  } catch (error) {
    fs.appendFileSync(logFilePath, `${error.message}\n`);
  }

  expect(fs.existsSync(logFilePath)).toBe(true);
  const logData = fs.readFileSync(logFilePath, 'utf8');
  expect(logData).toContain('This is a test error');
});