const mongoose = require("mongoose");
const User = require('../models/users-model.js');
const Collab = require('../models/collab-model.js');
const token = require('./token.js'); 


const sendCollab = (req, res, next) => {
    // TODO: verifica requisiti?
    let destination_user_id = req.params.user_id;
    let sender_user_id = req.loggedUser.id;

    // verifico che siano differenti (no collab con se stessi)
    if(destination_user_id == sender_user_id){
        return res.json({success: false, message: "Collaborazione con se stessi non disponibile"});
    }

    // verifico che entrambi gli account siano di artisti
    if (!req.loggedUser.is_artista){
        return res.json({success: false, message: "Devi essere un artista per avviare una collaborazione"});
    }
    
    let isArtist = true;
    User.findOne({id: destination_user_id}, function(err, item){
        if (err) {isArtist = false; return;}
        if(!item.is_artista) isArtist = false;
    });

    // destinatario non è un'artista
    if(!isArtist) return res.json({success: false, message: "Non puoi collaborare con un utente non artista"});

    // vedo se la collaborazione è già esistente
    Collab.find({from: sender_user_id, to: destination_user_id}, function(err, items){
        if (err) return res.json({success: false, message: "Error, qualcosa è andato storto"});
        if (items.length == 0){
            // collaborazione non esistente in precedenza
            Collab.create({from: sender_user_id, to: destination_user_id, status: "SENT"}, function(err, item){
                if (err) return res.json({success: false, message: "Error creating a collab request"});
                console.log(item);
                return res.json({success: true, message: "Collab request created", accept: {path: "/collab/collab_id/" + item.id, method: "GET"}, decline: {path: "/collab/collab_id/" + item.id, method: "DELETE"}});
            })
        } else {
            // collaborazione già esistente, resituisco errore e stato vecchia collab
            return res.json({success: false, message: "Collaborazione già esistente", status: items[0].status});
        }
    });
}


const acceptCollab = (req, res, next) => {
    let user_id = req.loggedUser.id;
    let collab_id = req.params.collab_id;

    // contollo che la collab sia in stato pendente (controllo non necessario, ma utile)
    Collab.findOne({id: collab_id}, function(err, item){
        if (err) return res.json({success: true, message: "Errore nell'accettare la richiesta di collaborazione"});
        if (item.status == "ACCEPTED") {return res.json({success: false, message: "Collab già accettata"});} 
    });

    // imposto la collab con stato attivo
    // la imposto cercando con user_id e collab_id, per verificare che sia effettivamente rivolta a me
    Collab.findOneAndUpdate({to: user_id, id: collab_id}, {status: "ACCEPTED"}, function(err){
        if (err) res.json({success: false, message: "Impossibile accettare la richiesta di collaborazione"});
        res.json({success: true, message: "Collaborazione accettata"});
    })
}

const declineCollab = (req, res, next) => {
    let user_id = req.loggedUser.id;
    let collab_id = req.params.collab_id;

    var from_me = req.query.from_me;
    console.log(from_me);

    // contollo che la collab sia in stato pendente (controllo non necessario, ma utile)
    Collab.findOne({id: collab_id}, function(err, item){
        console.log(item.status);
        if (err) return res.json({success: true, message: "Errore nell'accettare la richiesta di collaborazione"});
        if (item.status == "REJECTED") {return res.json({success: false, message: "Collab già rifiutata"});} 
    });    

    // imposto la collab con stato rifiutato
    // la imposto cercando con user_id e collab_id, per verificare che sia effettivamente rivolta a me
    if (from_me == null || from_me == "false"){
        Collab.findOneAndUpdate({to: user_id, id: collab_id}, {status: "REJECTED"}, function(err, item){
            console.log(item);
            if (err) return res.json({success: false, message: "Impossibile rifiutare la richiesta di collaborazione"});
            return res.json({success: true, message: "Collaborazione rifiutata"});
        });
    } else {
        Collab.findOneAndDelete({from: user_id, id: collab_id}, function(err){
            if (err) return res.json({success: false, message: "Impossibile eliminare la richiesta di collaborazione"});
            return res.json({success: true, message: "Collaborazione eliminata"});
    
        });
    }

}

const getAllCollabs = (req, res, next) => {
    let user_id = req.loggedUser.id;

    Collab.find({$or:[{from: user_id}, {to: user_id}]}, function(err, items){
        if (err) return res.json({success: false, message: "Errore nel cercare le tue richieste"})
        return res.json({success: true, collabs: items})
    });

}

const getAllCollabsByStatus = (req, res, next) => {
    let user_id = req.loggedUser.id;
    let status = req.params.status;

    // nella query aggiungo un parametro from_me = true se voglio quelle inviate da me, false quelle ricevute vuoto entrambe
    // ES. /status/ACCEPTED?from_me=true
    let from_me = req.query.from_me;
    if(from_me == null){
        // non c'è il parametro, le mando tutte
        Collab.find({$or:[{from: user_id, status: status}, {to: user_id, status: status}]}, function(err, items){
            if (err) return res.json({success: false, message: "Errore nel cercare le tue richieste"})
            return res.json({success: true, collabs: items})
        });
    } else if(from_me == "true"){
        Collab.find({from: user_id, status: status}, function(err, items){
            if (err) return res.json({success: false, message: "Errore nel cercare le tue richieste"})
            return res.json({success: true, collabs: items})
        });
    } else if(from_me == "false"){
        Collab.find({to: user_id, status: status}, function(err, items){
            if (err) return res.json({success: false, message: "Errore nel cercare le tue richieste"})
            return res.json({success: true, collabs: items})
        });
    } else{
        return res.json({success: false, message: "Richiesta mal formata"});
    }

    
}


module.exports = {
    sendCollab,
    acceptCollab,
    declineCollab,
    getAllCollabs,
    getAllCollabsByStatus
};
