const mongoose = require('mongoose');

// set up a mongoose model
var ChatSchema = mongoose.Schema({
    nome_utente: String,
    id_utente: String,
    message: String,
    community_id: String,
}, {collection: 'chats'});

const Chat = mongoose.model("SoundMatch", ChatSchema);
module.exports = Chat;