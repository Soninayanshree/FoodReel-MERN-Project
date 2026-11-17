/**
 * Reusable file validation middleware
 * Checks whether the required file is uploaded.
 */
const AppError = require("../utils/appError");

function validateFile(fieldName) {
  return (req, res, next) => {
    // Check if the uploaded file exists
    if (!req.file) {
      throw new AppError(400, `Missing required file: ${fieldName}`);
    }
   next();
  };
}

module.exports = validateFile;