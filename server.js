const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./db");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/uploads", express.static(path.join(__dirname, "data/uploads")));

app.use("/training", require("./controllers/trainingController"));
app.use("/flashcard", require("./controllers/flashcardController"));
app.use("/deck", require("./controllers/deckController"));

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening on port: ${process.env.PORT}`);
});
