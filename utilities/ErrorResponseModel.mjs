class ErrorResponse extends Error {
    /**
     * Constructs an ErrorResponse instance.
     *
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {boolean} [success=false] - Indicates whether the operation was successful.
     * @param {string} [errorType='Error'] - The type of error (e.g., 'ValidationError', 'AuthenticationError').
     */
    constructor(message, statusCode, success = false, errorType = 'Error') {
      super(message);
      this.statusCode = statusCode;
      this.success = success || !`${statusCode}`.startsWith('4');
      this.errorType = errorType;
      this.timestamp = new Date().toISOString();
    }
  
    /**
     *
     * @returns {Object}
     */
    toJSON() {
      return {
        success: this.success,
        statusCode: this.statusCode,
        errorType: this.errorType,
        message: this.message,
        timestamp: this.timestamp,
      };
    }
  }
  
  export default ErrorResponse;