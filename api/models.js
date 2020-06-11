const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    fullName: String,
    password: String,
    adminAccount: Boolean,
  },
  { collection: "users" }
);

const signatureSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  date: String,
});

const suggestionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: String,
    username: String,
    fullName: String,
    visibility: Boolean,
    signatures: [signatureSchema],
  },
  { collection: "suggestions" }
);

module.exports = {
  Suggestion: mongoose.model("Suggestion", suggestionSchema),
  Signature: mongoose.model("Signature", signatureSchema),
  User: mongoose.model("User", userSchema),
};
