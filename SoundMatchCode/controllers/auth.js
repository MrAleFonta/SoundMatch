const { json } = require("express");
const mongoose = require("mongoose");
const User = require('../models/users-model.js');   //to import the routes/song.js
const token = require('./token.js');            // metodo per creare token



// create an account
const createAccount = (req, res, next) => {

  console.log(req.body);

  let email = req.body.email;
  let password = req.body.password;
  let nome_utente = req.body.nome_utente;
  let is_artista = req.body.is_artista;

  // controllo che non ci sia già questo nome utente in DB, altrimenti do errore

  // salvo utente
  const user = new User({ nome_utente: nome_utente,
                          email: email,
                          password_hash: password,
                          is_artista: is_artista});

    user.save(function (err, item) {
      if (err){
        console.log(err)
        return res.json({success: false, message: "Error, user not saved"});
      }
      console.log(item.id)
      let mtoken = token.createToken(item.email, item.id, item.is_artista);
      console.log(mtoken)
      return res.json({success: true,
                       token: mtoken,
                       message: "Success, user saved"});
    });
};

// login, verifico credenziali e restituisco token
const login = function (req, res, next) {
  let email = req.body.email
  let password = req.body.password

  // verifico che ci siano email e password nella richiesta
  if(!email || !password)
    return res.json({success: false, message: "Error, give all the information"})

  User.findOne({ email: email }, function(err, user){
    if(err) return res.json({success: false, message: "Error"});
    // TODO: password hash
    if (user.password_hash != password){
      // password non corretta
      return res.json({success: false, message: "Wrong password"})
    }
    console.log(user);
    let stringtoken = token.createToken(user.email, user.id, user.is_artista);
    return res.json({success: true, message: "Token generated", token: stringtoken})
  });
}


module.exports = {
  createAccount,
  login
};
