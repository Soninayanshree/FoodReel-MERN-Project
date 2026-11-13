/**
 * Reusable file validation middleware
 * Checks whether the required file is uploaded.
 */

function validateFile(fieldName) {
  return (req, res, next) => {
    // Check if the uploaded file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: `${fieldName} file is required`,
      });
    }

    next();
  };
}

module.exports = validateFile;