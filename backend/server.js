// Import necessary modules
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const cors = require("cors");

// Enable CORS
app.use(cors());

// Use the express-fileupload middleware for file uploads
app.use(fileUpload());

// Serve static files (optional, for example to serve HTML forms or other assets)
app.use(express.static("public"));

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send("No file uploaded.");
    }

    const image = req.files.image;
    // Get current date and time in 'YYYYMMDDHHMMSS' format
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    // Add timestamp to the file name
    const uploadPath = path.join(uploadDir, `${timestamp}_${image.name}`);

    await image.mv(uploadPath);
    res.status(200).send("File uploaded successfully.");
  } catch (err) {
    console.error("Error during file upload:", err);
    res.status(500).send("Error uploading file.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
