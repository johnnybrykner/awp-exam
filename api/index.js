const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const models = require("./models");
const mongoose = require("mongoose");
const path = require("path");

const port = process.env.PORT || 8080;
const app = express();
const buildPath = path.join(__dirname, "..", "frontend", "build");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(buildPath));

app.get("/api/hii", (req, res) => res.json({ message: "Hii from the API" }));

app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => console.log(`The API is running on port ${port}!`));
