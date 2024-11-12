const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const cors = require("cors");

// Enable CORS
app.use(cors());

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the upload directory exists
    }
    cb(null, uploadDir); // Destination directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Ensure unique filenames with timestamps
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Serve static files (optional)
app.use(express.static("public"));

// Endpoint to upload image
app.post("/upload", upload.single("image"), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  console.log("File uploaded:", req.file);
  res.status(200).send("File uploaded successfully.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
