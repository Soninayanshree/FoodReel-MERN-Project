class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);//custom message 
        
        this.statusCode = statusCode;//set http status code for the error
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
