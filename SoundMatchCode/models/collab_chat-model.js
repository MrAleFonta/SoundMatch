const mongoose = require("mongoose");

const CollabChatSchema = new mongoose.Schema({
  from: {type: mongoose.Schema.Types.ObjectId, ref: 'Artist'},
  collab: {type: mongoose.Schema.Types.ObjectId, ref: 'Collab'},
  text: {type: String},
  datetime: {},
  status: {type: String}                                            // SENT, READ
}, {collection: 'collab_chats'});

const CollabChat = mongoose.model("CollabChat", CollabChatSchema);
module.exports = CollabChat;