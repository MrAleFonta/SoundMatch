const express = require('express');
const collabRouter = express.Router();
const collabController = require('../controllers/collab.js');
const token = require('../controllers/token.js');
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

// send collab request
collabRouter.get('/user_id/:user_id', jsonParser, token.checkToken)
collabRouter.get('/user_id/:user_id', jsonParser, collabController.sendCollab);

// accept collab request
collabRouter.get('/collab_id/:collab_id', jsonParser, token.checkToken);
collabRouter.get('/collab_id/:collab_id', jsonParser, collabController.acceptCollab);

// rifiuto collab o annullo
collabRouter.delete('/collab_id/:collab_id', jsonParser, token.checkToken);
collabRouter.delete('/collab_id/:collab_id', jsonParser, collabController.declineCollab);


// end collab request
// non necessario da sviluppare per il funzionamento dell'app

// get all collab of the logged user
collabRouter.get('', jsonParser, token.checkToken)
collabRouter.get('', jsonParser, collabController.getAllCollabs);

// get all collab of the logged user by status
collabRouter.get('/status/:status', jsonParser, token.checkToken)
collabRouter.get('/status/:status', jsonParser, collabController.getAllCollabsByStatus);


module.exports = collabRouter;    // export to use in index.js
