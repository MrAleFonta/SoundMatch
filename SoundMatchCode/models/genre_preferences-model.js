const mongoose = require("mongoose");

const GenrePreferencesSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId},
    genres: {type: [mongoose.Schema.Types.ObjectId]}
}, {collection: 'genre_preferences'});

const GenrePreferences = mongoose.model("GenresPreferences", GenrePreferencesSchema);
module.exports = GenrePreferences;