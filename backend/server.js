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

// Serve static files (optional, for example to serve HTML forms or other assets)
app.use(express.static("public"));

// To parse the JSON data sent with the form
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Use the express-fileupload middleware for file uploads
app.use(fileUpload());

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// The path where we will save the JSON data
const jsonFilePath = path.join(__dirname, "data", "cards.json");

// Ensure the 'data' directory exists for JSON file storage
const dataDir = path.dirname(jsonFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

app.post("/upload", async (req, res) => {
  try {
    const image = req.files.image;

    // Get current date and time in 'YYYYMMDDHHMMSS' format
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");

    // Add timestamp to the file name
    const uploadPath = path.join("upload", `${timestamp}_${image.name}`);

    // Move the image file to the upload directory
    await image.mv(uploadPath);

    // Check if card data is present in the request body
    if (!req.body.card) {
      return res.status(400).send("No card data provided.");
    }

    // Parse the mock card data from the request body
    const mockCard = JSON.parse(req.body.card);
    console.log("Mock card data received:", mockCard);

    // Read the existing data from the JSON file
    fs.readFile(jsonFilePath, "utf-8", (err, data) => {
      let cards = [];
      if (err) {
        // If the file doesn't exist or there's an error, initialize an empty array
        console.log("No existing cards found. Creating a new file.");
      } else {
        try {
          cards = JSON.parse(data);
          // Ensure the data is an array
          if (!Array.isArray(cards)) {
            console.error("Data in the file is not an array. Resetting to an empty array.");
            cards = [];
          }
        } catch (parseError) {
          console.error("Error parsing existing JSON data:", parseError);
          cards = [];
        }
      }

      // Add the new mock card to the array
      cards.push({
        ...mockCard,
        Img: uploadPath, // Include the path of the uploaded image
      });

      // Write the updated array back to the JSON file
      fs.writeFile(jsonFilePath, JSON.stringify(cards, null, 2), (err) => {
        if (err) {
          console.error("Error saving JSON data:", err);
          return res.status(500).send("Error saving card data.");
        }

        res.status(200).send("File uploaded and card data saved.");
      });
    });
  } catch (err) {
    console.error("Error during file upload:", err);
    res.status(500).send("Error uploading file.");
  }
});

// Route to get all card data
app.get("/cards", (req, res) => {
  fs.readFile(jsonFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      return res.status(500).send("Error reading card data.");
    }

    try {
      const cards = JSON.parse(data);

      // Ensure the data is an array
      if (!Array.isArray(cards)) {
        return res.status(500).send("Data in the file is corrupted.");
      }

      // Return the cards data as a JSON response
      res.status(200).json(cards);
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return res.status(500).send("Error parsing card data.");
    }
  });
});

app.get("/getTrainSession", (req, res) => {
  try {
    // Read the cards from the JSON file
    fs.readFile(jsonFilePath, "utf-8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading card data.");
      }

      let cards = JSON.parse(data);
      const currentTime = Date.now();

      // Filter the cards based on the repeatNumber and nextRepeat condition
      const filteredCards = cards.filter((card) => {
        const nextRepeat = card.nextRepeat;
        const timeDifference = currentTime - nextRepeat;

        switch (card.repeatNumber) {
          case 0:
            return true;
          case 1:
            return timeDifference > 30 * 60 * 1000; // 30 minutes
          case 2:
            return timeDifference > 2 * 60 * 60 * 1000; // 2 hours
          case 3:
            return timeDifference > 8 * 60 * 60 * 1000; // 8 hours
          case 4:
            return timeDifference > 24 * 60 * 60 * 1000; // 1 day
          case 5:
            return timeDifference > 3 * 24 * 60 * 60 * 1000; // 3 days
          default:
            return false;
        }
      });

      res.status(200).json(filteredCards);
    });
  } catch (error) {
    console.error("Error during filtering:", error);
    res.status(500).send("Error filtering card data.");
  }
});

// Endpoint to increase repeatNumber
app.get("/trainChangeRepeatNumber/:id", (req, res) => {
  const cardId = parseInt(req.params.id, 10);

  // Read the current cards data from the JSON file
  fs.readFile(jsonFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading card data.");
    }

    let cards = JSON.parse(data);

    // Find the card by ID
    const cardIndex = cards.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) {
      return res.status(404).send("Card not found.");
    }

    // Increase repeatNumber for the found card
    cards[cardIndex].repeatNumber += 1;

    // Save the updated cards data back to the file
    fs.writeFile(jsonFilePath, JSON.stringify(cards, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error updating repeatNumber.");
      }

      // Respond with the updated card data
      res.status(200).json(cards[cardIndex]);
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
