const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const jsonFilePath = path.join(__dirname, "..", "data", "cards.json");

router.post("/upload", async (req, res) => {
  try {
    let uploadPath = "404";
    if (req.files?.image) {
      const image = req.files.image;
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
      const uploadPath = path.join("data/upload", `${timestamp}_${image.name}`);
      await image.mv(uploadPath);
    }

    if (!req.body.card) return res.status(400).send("No card data provided.");

    const newCard = JSON.parse(req.body.card);

    fs.readFile(jsonFilePath, "utf-8", (err, data) => {
      let cards = [];

      try {
        cards = JSON.parse(data);
        if (!Array.isArray(cards)) {
          console.error("Data in the file is not an array. Resetting to an empty array.");
          cards = [];
        }
      } catch (parseError) {
        console.error("Error parsing existing JSON data:", parseError);
        cards = [];
      }

      cards.push({
        ...newCard,
        Img: uploadPath,
      });

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

router.get("/getAll", (req, res) => {
  fs.readFile(jsonFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading the JSON file:", err);
      return res.status(500).send("Error reading cards.json");
    }

    try {
      const cards = JSON.parse(data);
      res.status(200).json(cards);
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return res.status(500).send("Error parsing card data.");
    }
  });
});

module.exports = router;
