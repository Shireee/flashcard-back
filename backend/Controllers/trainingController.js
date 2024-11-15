const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const jsonFilePath = path.join(__dirname, "..", "data", "cards.json");

router.get("/getTraingSession", (req, res) => {
  try {
    fs.readFile(jsonFilePath, "utf-8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading card data.");
      }

      const cards = JSON.parse(data);
      const currentTime = Date.now();

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
router.patch("/updateRepeatNumber/:id", (req, res) => {
  const cardId = parseInt(req.params.id, 10);

  fs.readFile(jsonFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading card data.");
    }

    const cards = JSON.parse(data);
    const cardIndex = cards.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) {
      return res.status(404).send("Card not found.");
    }

    // Update the repeatNumber and nextRepeat
    const currentTime = Date.now();
    cards[cardIndex].repeatNumber += 1;
    const { repeatNumber } = cards[cardIndex];

    switch (repeatNumber) {
      case 1:
        cards[cardIndex].nextRepeat = currentTime + 30 * 60 * 1000; // 30 minutes
        break;
      case 2:
        cards[cardIndex].nextRepeat = currentTime + 2 * 60 * 60 * 1000; // 2 hours
        break;
      case 3:
        cards[cardIndex].nextRepeat = currentTime + 8 * 60 * 60 * 1000; // 8 hours
        break;
      case 4:
        cards[cardIndex].nextRepeat = currentTime + 24 * 60 * 60 * 1000; // 1 day
        break;
      case 5:
        cards[cardIndex].nextRepeat = currentTime + 3 * 24 * 60 * 60 * 1000; // 3 days
        break;
      default:
        cards[cardIndex].nextRepeat = currentTime; // Default to the current time for safety
        break;
    }

    fs.writeFile(jsonFilePath, JSON.stringify(cards, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error updating repeatNumber and nextRepeat.");
      }

      res.status(200).json(cards[cardIndex]);
    });
  });
});

module.exports = router;
