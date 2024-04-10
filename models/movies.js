//SCHEMA FOR DATABASE
const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    poster: String,
    fullplot: String,
    languages: [String],
    released: Date,
    directors: [String],
    rated: String,
    awards: {
        wins: Number,
        nominations: Number,
        text: String,
        lastupdated: String
    },
    year: Number,
    imdb: {
        rating: Number,
        votes: Number,
        id: Number
    },
    countries: [String],
    type: String,
    tomatoes: {
        viewer: {
            fresh: Number,
            critic: {
                rotten: Number,
                lastUpdated: Date
            }
        },
        num_mflix_comments: Number
    }
});

module.exports = mongoose.model("movies", movieSchema);
