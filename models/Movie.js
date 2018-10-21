
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema(
    {
        director_id: mongoose.Schema.Types.ObjectId,
        title: {
            type: String,
            required: [true, '`{PATH}` alanı zorunludur.'],
            maxlength: [60, '`{PATH}` alanı (`{VALUE}`), (`{MAXLENGTH}`) karakterden küçük olmalı.'],
            minlength: [2, '`{PATH}` alanı (`{VALUE}`), (`{MINLENGTH}`) karakterden büüyük olmalı.'],
        },
        category: String,
        country: String,
        year: {
            type: Number,
            max: Date.year,
            min: 1760
        },
        imdb_score: {
            type: Number,
            max: 10,
            min: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        actors: []
    }
);

module.exports = mongoose.model("movie", MovieSchema);