const multer = require("multer");
const path = require("path");

// Storage -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
  }
});

// Allowed Extensions -------------------
const allowedExtensions = [
  ".jpeg", ".jpg", ".png", ".gif",
  ".pdf", ".doc", ".docx",
  ".ppt", ".pptx",
  ".txt"
];

// File Filter --------------------------
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    req.fileValidationError = "Invalid file type";
    return cb(null, false);
  }

  cb(null, true);
};

// Multer Instance ----------------------
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter
});

module.exports = upload;
