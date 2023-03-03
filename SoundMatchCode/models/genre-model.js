const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
    genre: {String},
    img: {String}
}, {collection: 'genres'});

const Genres = mongoose.model("Genres", GenreSchema);
module.exports = Genres;