// Import necessary modules
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const cors = require("cors");
const trainingController = require("./Controllers/trainingController");
const flashcardController = require("./Controllers/flashcardController");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/training", trainingController);
app.use("/flashcard", flashcardController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
