const mongoose = require("mongoose");

const CollabSchema = new mongoose.Schema({
  from: {type: mongoose.Schema.Types.ObjectId, ref: 'Artist'},
  to: {type: mongoose.Schema.Types.ObjectId, ref: 'Artist'},
  status: {type: String}                                            // SENT, ACCEPTED, TERMINATED, REJECTED
}, {collection: 'collabs'});

const Collab = mongoose.model("Collab", CollabSchema);
module.exports = Collab;