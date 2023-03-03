const mongoose = require("mongoose");
const User = require('../models/users-model.js');
const Collab = require('../models/collab-model.js');
const token = require('./token.js'); 

// trovo artisti tranne me, da vedere se utile o meno
const getArtists = (req, res, next) => {
    User.find({is_artista: true}).where('_id').ne(req.loggedUser.id).exec(
        function(err, artists){
        if (err) return res.json({success: false, messeage: "Errore"})
        return res.json({artists});
    });
     
}

module.exports = {
    getArtists
};
