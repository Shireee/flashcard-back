const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/all", async (req, res) => {
  try {
    const data = await db.any("SELECT * FROM decks");
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const deckId = parseInt(req.params.id, 10);
  try {
    const data = await db.any(`SELECT * FROM decks WHERE id=${deckId}`);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const { name, icon } = req.body;
  try {
    const result = await db.one("INSERT INTO decks (name, icon) VALUES ($1, $2) RETURNING *", [
      name,
      icon,
    ]);
    res.status(201).json({ message: "Deck added successfully", deck: result });
  } catch (error) {
    console.error("Error inserting deck:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const deckId = parseInt(req.params.id, 10);
  try {
    const result = await db.none("DELETE FROM decks WHERE id = $1", [deckId]);
    res.status(200).json({ message: "Deck and its cards deleted successfully" });
  } catch (error) {
    console.error("Error deleting deck:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const deckId = parseInt(req.params.id, 10);
  const { name, icon } = req.body;

  try {
    let result;
    if (name && icon) {
      result = await db.one(`UPDATE decks SET name = $1, icon = $2 WHERE id = $3 RETURNING *`, [
        name,
        icon,
        deckId,
      ]);
    } else if (name) {
      result = await db.one(`UPDATE decks SET name = $1 WHERE id = $2 RETURNING *`, [name, deckId]);
    } else {
      result = await db.one(`UPDATE decks SET icon = $1 WHERE id = $2 RETURNING *`, [icon, deckId]);
    }

    res.status(200).json({
      message: "Deck updated successfully",
      deck: result,
    });
  } catch (error) {
    console.error("Error updating deck:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
