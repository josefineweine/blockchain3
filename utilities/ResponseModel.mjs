class ResponseModel {
    /**
     *
     * @param {Object} options 
     * @param {number} [options.statusCode=404] 
     * @param {any} [options.data=null] 
     * @param {string|null} [options.error=null] 
     * @param {string} [options.message='']
     */
    constructor({ statusCode = 404, data = null, error = null, message = '' }) {
      this.statusCode = statusCode;
      this.success = this._determineSuccess(statusCode);
      this.message = message || this._defaultMessage(statusCode);
      this.error = error;
      this.data = data;
      this.items = this._countItems(data);
    }
  
    /**
     *
     * @param {number} statusCode 
     * @returns {boolean} 
     */
    _determineSuccess(statusCode) {
      return statusCode >= 200 && statusCode <= 299;
    }
  
    /**
     *
     * @param {number} statusCode 
     * @returns {string} 
     */
    _defaultMessage(statusCode) {
      if (statusCode >= 200 && statusCode < 300) return 'Operation was successful.';
      if (statusCode >= 400 && statusCode < 500) return 'Client error occurred.';
      if (statusCode >= 500) return 'Server error occurred.';
      return 'Unexpected status code.';
    }
  
    /**
     *
     * @param {any} data 
     * @returns {number} 
     */
    _countItems(data) {
      if (!data) return 0;
      return Array.isArray(data) ? data.length : 1;
    }
  
    /**
     *
     * @returns {Object} 
     */
    toJSON() {
      return {
        success: this.success,
        statusCode: this.statusCode,
        message: this.message,
        error: this.error,
        data: this.data,
        items: this.items,
      };
    }
  }
  
  export default ResponseModel;
  