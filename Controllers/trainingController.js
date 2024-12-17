const express = require("express");
const db = require("../db"); // Предполагается, что у вас есть подключение к БД через pg-promise или pg
const router = express.Router();

// Получение карточек для тренировки
router.get("/getTraingSession", async (req, res) => {
  try {
    const currentTime = Date.now();

    // Запрос всех карточек
    const cards = await db.any(`
      SELECT * FROM cards
    `);

    const filteredCards = cards.filter((card) => {
      const nextRepeat = card.next_repeat;
      const timeDifference = currentTime - nextRepeat;

      switch (card.repeat_number) {
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

    // Отправляем ответ
    res.status(200).json({
      sessionLength: filteredCards.length,
      content: filteredCards,
    });
  } catch (error) {
    console.error("Error during filtering:", error);
    res.status(500).send("Error filtering card data.");
  }
});

// Обновление номера повторения и времени следующего повторения
router.patch("/updateRepeatNumber/:id", async (req, res) => {
  const cardId = parseInt(req.params.id, 10);

  try {
    // Получаем карточку по ID
    const card = await db.oneOrNone("SELECT * FROM cards WHERE id = $1", [cardId]);

    if (!card) {
      return res.status(404).send("Card not found.");
    }

    const currentTime = Date.now();
    let newRepeatNumber = card.repeat_number + 1;
    let newNextRepeat = currentTime;

    // Обновляем next_repeat в зависимости от нового repeat_number
    switch (newRepeatNumber) {
      case 1:
        newNextRepeat = currentTime + 30 * 60 * 1000; // 30 minutes
        break;
      case 2:
        newNextRepeat = currentTime + 2 * 60 * 60 * 1000; // 2 hours
        break;
      case 3:
        newNextRepeat = currentTime + 8 * 60 * 60 * 1000; // 8 hours
        break;
      case 4:
        newNextRepeat = currentTime + 24 * 60 * 60 * 1000; // 1 day
        break;
      case 5:
        newNextRepeat = currentTime + 3 * 24 * 60 * 60 * 1000; // 3 days
        break;
      default:
        break;
    }

    // Обновляем карточку в базе данных
    await db.none(
      `
        UPDATE cards
        SET repeat_number = $1, next_repeat = $2
        WHERE id = $3
      `,
      [newRepeatNumber, newNextRepeat, cardId]
    );

    // Отправляем обновленную карточку
    const updatedCard = { ...card, repeat_number: newRepeatNumber, next_repeat: newNextRepeat };
    res.status(200).json(updatedCard);
  } catch (err) {
    console.error("Error updating repeatNumber and nextRepeat:", err);
    res.status(500).send("Error updating repeatNumber and nextRepeat.");
  }
});

module.exports = router;
