const mongoose = require("mongoose");
const User = require('../models/users-model.js');
const Genre = require('../models/genre-model.js');
const GenrePreferences = require('../models/genre_preferences-model.js');
const token = require('./token.js'); 

const getAllGenres = (req, res, next) => {
    Genre.find({}, function(err, items){
        if (err) return res.json({success: false, message: "Qualcosa è andato storto, non siamo riusciti a recuperare i generi"})
        return res.json({success: true, genres: items});
    });
}

const saveUserGenres = (req, res, next) => {
    // se non c'è nulla di salvato, salvo. Altrimenti sovrascrivo le modifiche
    let genres = req.body.genres;
    let user_id = req.loggedUser.id;
    GenrePreferences.findOneAndUpdate({_id: user_id}, {_id: user_id, genres: genres}, {new: true, upsert: true}, function(err, item){
        if (err) return res.json({success: false, message: "Errore, non siamo riusciti a impostare le tue preferenze"});
        return res.json({success: true, genres: item.genres});
    });
}

module.exports = {
    getAllGenres,
    saveUserGenres
};