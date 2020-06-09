const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const models = require("./models");
const mongoose = require("mongoose");
const path = require("path");
const validate = require("express-jwt");

const port = process.env.PORT || 8080;
const app = express();
const buildPath = path.join(__dirname, "..", "frontend", "build");

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(buildPath));

(async (_) => {
  try {
    const url = process.env.CONNECTION_STRING;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Database connection failed: ", error);
  }
})();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

app.get("/api/suggestions", async (req, res) =>
  res.json(await models.Suggestion.find({}))
);

app.post("/api/suggestions", async (req, res) => {
  try {
    const newSuggestion = new models.Suggestion({
      ...req.body,
    });
    await newSuggestion.save();
  } catch (error) {
    res.status(400).send({ error: "Suggestion" });
  }
  res.json(await models.Suggestion.find({}));
});

app.get("/api/suggestion/:id", async (req, res) => {
  res.json(await models.Suggestion.findOne({ _id: req.params.id }));
});

app.put("/api/suggestion/:id", async (req, res) => {
  try {
    let toBeUpdated = await models.Suggestion.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    await toBeUpdated.save();
  } catch (error) {
    res.status(400).send({ error: "Suggestion update failed" });
  }
  res.json(await models.Suggestion.findOne({ _id: req.params.id }));
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const dbMatch = await models.User.findOne({ username });
  if (dbMatch) {
    res.status(401).send({ error: "User already exists" });
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        const newUser = new models.User({
          ...req.body,
          password: hash,
        });
        await newUser.save();
      });
    });
    const token = signToken({ username });
    res.json({
      message: `Hello ${username}, welcome to the suggestion box!`,
      token,
    });
  }
});

app.get(
  "/api/session",
  validate({
    secret: process.env.JWT_SECRET,
  }),
  function (req, res) {
    if (req.user.username) {
      res.json(req.user);
    } else {
      res
        .status(401)
        .send({ error: "Session is no longer valid, log in again" });
    }
  }
);

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const dbMatch = await models.User.findOne({ username: username });
  if (dbMatch) {
    bcrypt.compare(password, dbMatch.password, function (err, valid) {
      if (valid)
        res.json({
          message: `Welcome back, ${username}!`,
          username,
          fullName: dbMatch.fullName,
          token: signToken({ username, fullName: dbMatch.fullName }),
        });
      else res.status(401).send({ error: "Password mismatch" });
    });
  } else {
    res.status(404).send({ error: "User not found" });
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => console.log(`The API is running on port ${port}!`));
