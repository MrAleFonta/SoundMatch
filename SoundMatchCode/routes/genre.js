const express = require('express');
const genreRouter = express.Router();
const genreController = require('../controllers/genre.js');
const token = require('../controllers/token.js');
var bodyParser = require('body-parser');
const collabRouter = require('./collab.js');

var jsonParser = bodyParser.json()

// get all genres
genreRouter.get('', jsonParser, token.checkToken);
genreRouter.get('', jsonParser, genreController.getAllGenres);

// salvo i generi per l'utente
genreRouter.post('', jsonParser, token.checkToken);
genreRouter.post('', jsonParser, genreController.saveUserGenres);

// salvo i generi per l'artista


module.exports = genreRouter;    // export to use in index.js
