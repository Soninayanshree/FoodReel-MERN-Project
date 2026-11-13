const multer = require("multer");

// Allowed video MIME types
const allowedVideoTypes = [
  "video/mp4",
  "video/mpeg",
  "video/webm",
  "video/quicktime",
];

// Configure Multer
const upload = multer({
  // Store uploaded files temporarily in memory
  storage: multer.memoryStorage(),

  // Maximum file size: 50 MB
  limits: {
    fileSize: 50 * 1024 * 1024,
  },

  // Validate uploaded file type
  fileFilter: (req, file, cb) => {
    if (!allowedVideoTypes.includes(file.mimetype)) {
      const error = new Error(
        "Only MP4, WebM, and MOV videos are allowed"
      );

      error.statusCode = 400;

      return cb(error);
    }

    cb(null, true);
  },
});

module.exports = upload;