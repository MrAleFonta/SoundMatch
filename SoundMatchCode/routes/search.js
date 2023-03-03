const express = require('express');
const searchRouter = express.Router();
const searchController = require('../controllers/search.js');
const token = require('../controllers/token.js');
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()


// get all artists
searchRouter.get('/artists', jsonParser, token.checkToken)
searchRouter.get('/artists', jsonParser, searchController.getArtists);


module.exports = searchRouter;    // export to use in index.js
