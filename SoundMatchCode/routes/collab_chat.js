const express = require('express');
const collabChatRouter = express.Router();
const collabController = require('../controllers/collab_chat.js');
const token = require('../controllers/token.js');
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

// send message
collabChatRouter.post('/collab_id/:collab_id', jsonParser, token.checkToken)
collabChatRouter.post('/collab_id/:collab_id', jsonParser, collabController.sendMessage);

// get all collab messages
collabChatRouter.get('/collab_id/:collab_id', jsonParser, token.checkToken)
collabChatRouter.get('/collab_id/:collab_id', jsonParser, collabController.getMessages);

// get other member name
collabChatRouter.get('/collab_id/:collab_id/name', jsonParser, token.checkToken)
collabChatRouter.get('/collab_id/:collab_id/name', jsonParser, collabController.getName);

// set all messages of a chat as read
collabChatRouter.post('/collab_id/:collab_id/set_status/read', jsonParser, token.checkToken)
collabChatRouter.post('/collab_id/:collab_id/set_status/read', jsonParser, collabController.setRead);

// get all unread messages
collabChatRouter.get('/collab_id/:collab_id/status/sent', jsonParser, token.checkToken)
collabChatRouter.get('/collab_id/:collab_id/status/sent', jsonParser, collabController.getUnreadMessagges);

// delete a message
collabChatRouter.delete('/message_id/:message_id', jsonParser, token.checkToken);
collabChatRouter.delete('/message_id/:message_id', jsonParser, collabController.deleteMessage);


module.exports = collabChatRouter;    // export to use in index.js
