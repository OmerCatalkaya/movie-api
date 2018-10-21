const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
  name: {
    type: String,
    maxlength: [
      60,
      "`{PATH}` alanı (`{VALUE}`), (`{MAXLENGTH}`) karakterden küçük olmalı."
    ],
    minlength: [
      2,
      "`{PATH}` alanı (`{VALUE}`), (`{MINLENGTH}`) karakterden büüyük olmalı."
    ]
  },
  surname: {
    type: String
  },
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("director", DirectorSchema);
