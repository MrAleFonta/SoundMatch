const mongoose = require("mongoose");
const User = require('../models/users-model.js');
const Collab = require('../models/collab-model.js');
const CollabChat = require('../models/collab_chat-model.js');
const token = require('./token.js');
const { json } = require("express");

const sendMessage = (req, res, next) => {
    let user_id = req.loggedUser.id;

    // controllo ci sia il corpo del messaggio
    console.log(req.body);

    let text = req.body.text;
    if (text == null)
        return res.json({ success: false, message: "Testo vuoto" });

    // verifico che nella collab io sia presente e lo stato sia ACCEPTED
    var collab_id = req.params.collab_id;

    Collab.findById(collab_id, function (err, collab) {
        if (err) return res.json({ success: false, message: "Errore nel trovare la collaborazione" });
        if (collab.from != user_id && collab.to != user_id) {
            // utente manda messaggio ad una collaborazione non sua
            return res.json({ success: false, message: "Non puoi inviare messaggi in questa collaborazione" });
        }
        if (collab.status != "ACCEPTED") {
            // utente manda messaggio a chat ancora da accettare
            return res.json({ success: false, message: "Stato della collaborazione non ACCEPTED" });
        }

        // manda messaggio
        CollabChat.create({
            from: user_id,
            collab: collab_id,
            text: req.body.text,
            datetime: Date.now(),
            status: "SENT"
        }, function (err, message) {

            if (err) return res.json({ success: false, message: "Messaggio non inviato" });
            return res.json({ success: true, message: "Messaggio inviato", message: message })

        });

    })
}

const getMessages = (req, res, next) => {
    var collab_id = req.params.collab_id;
    var user_id = req.loggedUser.id;

    // prendo la collab e vedo se è dell'utente
    Collab.findById(collab_id, function (err, collab) {
        if (err) return res.json({ sucess: false, message: "Qualcosa è andato storto" });
        if (collab.from != user_id && collab.to != user_id)
            return res.json({ success: false, message: "Non puoi ottenere i messaggi di questa chat" });

        // restituisco chat 
        CollabChat.find({ collab: collab_id }, function (error, chat) {
            return res.json({ success: true, messagges: chat, my_id: user_id });
        });
    });
}

const setRead = (req, res, next) => {
    // setta tutti i messaggi che hanno come destinatario me e chat id quella passata come letti
    let collab_id = req.params.collab_id;
    let user_id = req.loggedUser.user_id;

    CollabChat.updateMany({ collab: collab_id, to: user_id }, { status: "READ" }, function (err) {
        if (err) return res.json({ success: false, message: "Non è stato possibile impostare come letti i tuoi messaggi" });
        res.json({ success: true, message: "Messaggi impostati come letti" });
    });
}

const getUnreadMessagges = (req, res, next) => {
    var collab_id = req.params.collab_id;
    var user_id = req.loggedUser.id;

    // prendo la collab e vedo se è dell'utente
    Collab.findById(collab_id, function (err, collab) {
        if (err) return res.json({ sucess: false, message: "Qualcosa è andato storto" });
        if (collab.from != user_id && collab.to != user_id)
            return res.json({ success: false, message: "Non puoi ottenere i messaggi di questa chat" });

        // restituisco chat 
        CollabChat.find({ collab: collab_id, status: "SENT" }, function (error, chat) {
            return res.json({ success: true, messagges: chat });
        });
    });
}

const deleteMessage = (req, res, next) => {
    // posso cancellare un messaggio se sono stato io a inviarlo
    let user_id = req.loggedUser.id;
    let message_id = req.message_id;

    CollabChat.findOneAndDelete({ from: user_id, id: message_id }, function (err) {
        if (err) return res.json({ success: false, message: "Errore nell'eliminare il messggio" });
        return res.json({ sucess: true, message: "Messaggio eliminato" });
    });
}

const getName = (req, res, next) => {
    let user_id = req.loggedUser.id;
    var collab_id = req.params.collab_id;
    console.log(collab_id)

    Collab.findById(collab_id, function (err, collab) {
        if (err) return res.json({ success: false, message: "Errore" });
        else {
            // cerco il come utente dell'id che non è il mio
            console.log(collab);
            let destionation_id = collab.from == user_id ? collab.to : collab.from;
            User.findById(destionation_id, function (err, utente) {
                if (err) return res.json({ success: false, message: "Errore" });
                return res.json({ success: true, nome_utente: utente.nome_utente })
            });
        }
    });

}

module.exports = {
    sendMessage,
    getMessages,
    setRead,
    getUnreadMessagges,
    deleteMessage,
    getName
};
