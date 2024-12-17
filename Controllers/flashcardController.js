const express = require("express");
const path = require("path");
const db = require("../db");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    let uploadPath = "default.png"; // Устанавливаем default путь к картинке

    // Проверяем, есть ли файл
    if (req.files?.image) {
      console.log("upload");
      const image = req.files.image;
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");

      // Сохраняем файл в data/uploads
      uploadPath = path.join("data/uploads", `${timestamp}_${image.name}`);
      await image.mv(uploadPath); // Загружаем файл

      // Путь, который будет сохраняться в JSON (относительный)
      uploadPath = `${timestamp}_${image.name}`;
    }

    if (!req.body.card) return res.status(400).send("No card data provided.");

    const newCard = JSON.parse(req.body.card);

    newCard.img = uploadPath;

    // Создаем новую карточку в базе данных
    const result = await db.one(
      `INSERT INTO cards (deck_id, item, item_reveal, repeat_number, next_repeat, img)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        newCard.deck_id,
        newCard.item,
        newCard.item_reveal,
        newCard.repeat_number || 0,
        newCard.next_repeat || 0,
        newCard.img,
      ]
    );

    // Если примеры есть, добавляем их в таблицу examples
    if (newCard.examples && newCard.examples.length > 0) {
      for (const example of newCard.examples) {
        await db.none(
          `INSERT INTO examples (card_id, item, item_reveal) 
           VALUES ($1, $2, $3)`,
          [result.id, example.item, example.item_reveal]
        );
      }
    }

    // Извлекаем примеры для возвращаемой карточки
    const examples = await db.any(`SELECT id, item, item_reveal FROM examples WHERE card_id = $1`, [
      result.id,
    ]);

    // Добавляем примеры в ответ
    result.examples = examples;

    // Возвращаем созданную карточку с примерами
    res.status(200).json(result);
  } catch (err) {
    console.error("Error during file upload:", err);
    res.status(500).send("Error uploading file.");
  }
});

router.get("/getByDeckId/:id", async (req, res) => {
  const deckId = req.params.id;
  try {
    // Получаем все карточки для данного deck_id
    const cards = await db.any(
      `
      SELECT 
        c.*, 
        COALESCE(
          json_agg(
            jsonb_strip_nulls(
              jsonb_build_object(
                'id', e.id,
                'item', e.item,
                'item_reveal', e.item_reveal
              )
            )
          ) FILTER (WHERE e.id IS NOT NULL), '[]'
        ) AS examples
      FROM 
        cards c
      LEFT JOIN 
        examples e ON c.id = e.card_id
      WHERE 
        c.deck_id = $1
      GROUP BY 
        c.id
    `,
      [deckId]
    );

    if (cards.length === 0) {
      return res.status(404).json({ message: "No cards found for this deck" });
    }

    // Возвращаем карточки с примерами
    res.status(200).json(cards);
  } catch (err) {
    console.error("Error fetching cards for deck:", err);
    res.status(500).send("Error fetching cards");
  }
});

router.get("/:id", async (req, res) => {
  const cardId = req.params.id;

  try {
    // Извлекаем карточку и связанные с ней примеры с помощью JOIN
    const card = await db.oneOrNone(
      `
      SELECT 
        c.*, 
        COALESCE(
          json_agg(
            jsonb_strip_nulls(
              jsonb_build_object(
                'id', e.id,
                'item', e.item,
                'item_reveal', e.item_reveal
              )
            )
          ) FILTER (WHERE e.id IS NOT NULL), '[]'
        ) AS examples
      FROM 
        cards c
      LEFT JOIN 
        examples e ON c.id = e.card_id
      WHERE 
        c.id = $1
      GROUP BY 
        c.id
    `,
      [cardId]
    );

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Возвращаем карточку с вложенными примерами без card_id
    res.status(200).json(card);
  } catch (err) {
    console.error("Error fetching card:", err);
    res.status(500).send("Error fetching card");
  }
});

router.delete("/delete/:id", async (req, res) => {
  const cardId = req.params.id;

  try {
    // Проверяем, существует ли карточка с таким ID и извлекаем примеры
    const card = await db.oneOrNone(
      `
      SELECT 
        c.*, 
        COALESCE(
          json_agg(
            jsonb_strip_nulls(
              jsonb_build_object(
                'id', e.id,
                'item', e.item,
                'item_reveal', e.item_reveal
              )
            )
          ) FILTER (WHERE e.id IS NOT NULL), '[]'
        ) AS examples
      FROM 
        cards c
      LEFT JOIN 
        examples e ON c.id = e.card_id
      WHERE 
        c.id = $1
      GROUP BY 
        c.id
    `,
      [cardId]
    );

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Удаляем карточку
    await db.none("DELETE FROM cards WHERE id = $1", [cardId]);

    // Возвращаем карточку с примерами
    res.status(200).json(card);
  } catch (err) {
    console.error("Error deleting card:", err);
    res.status(500).send("Error deleting card");
  }
});

// TODO
router.put("/update/:id", async (req, res) => {});

module.exports = router;
