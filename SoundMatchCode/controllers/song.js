// per upload canzone
const Song = require('../models/song-model.js');
const mongoose = require("mongoose");
var fs = require('fs');
var formidable = require('formidable');



// print all songs
const getSongs = async function (req, res, next) {
  res.json({success: true, songs: await Song.find()})
};

// print songs with a hint
// case insensitive di canzoni che contengono con quel testo
const getSongsByHint = async function (req, res, next) {
  // hint in query
  let hint = req.params.hint;
  var songs = await Song.find({title: { $regex: new RegExp(hint.toLowerCase(), "i") }}).exec();
  res.json({success: true, songs: songs});
};



// add song
/* Esempio di richiesta:
{
  token: "sdnmdpsfdsf",
  song: {
    title: "title",
    ecc.
  }
}
*/

/*
const newSong = (req, res, next) => {
  console.log(req);
  // controllo sia artista, altrimenti restituisco error
  // TODO: cambiare da isArtista a is_artista
  if (!req.loggedUser.is_artista){
    return res.status(403).json({success:false, message:'Not Authorized'});
  }

  let song = req.body.song;
  const songToSave = new Song({title: song.title,
                               artist: req.loggedUser.id,
                               file: song.file})

  songToSave.save(function (err, item) {
   if (err){
     console.log(err)
     return res.json({success: false, message: "Error, song not saved"});
   }
   return res.json({success: true,
                    message: "Success, song saved"});
  });

};*/

const newSong = (req, res, next) => {
  if (!req.loggedUser.is_artista){
    return res.status(403).json({success:false, message:'Not Authorized'});
  }
  let form = new formidable.IncomingForm();

  //Process the file upload in Node
  form.parse(req, function (error, fields, file) {
    let filepath = file.song.filepath;
    let newpath = 'public/uploads/';
    newpath += makeid(10) + file.song.originalFilename;

    //Copy the uploaded file to a custom folder
    fs.rename(filepath, newpath, function () {
      console.log(fields["title"]);
      const songToSave = new Song({title: fields["title"],
                                   artist: req.loggedUser.id,
                                   file: newpath.substring(7)})
    
      songToSave.save(function (err, item) {
       if (err){
         console.log(err)
         return res.json({success: false, message: "Error, song not saved"});
       }
       return res.json({success: true,
                        message: "Success, song saved"});
      });
    });
  });
}

// delete all songs by artist
const deleteSongs = (req, res, next) => {
  if (!req.loggedUser.is_artista){
    return res.status(403).json({success:false, message:'Not Authorized'});
  }
  // utente autenticato ed artista
  Song.deleteMany({artist: req.loggedUser.id}, function(err){
    if (err) return res.json({success: false, message: "Error deleting all songs"});
    return res.json({success: true, message: "All songs deleted"});

  })
};

// get one song by id
const getSong = (req, res, next) => {
  let song_id = req.params.song_id;
  Song.findOne({id: song_id}, function(err, song){
    if (err) return res.json({success: false, message: "Song not found, is the id correct?"})

    return res.json({success: true, song: song})
  })

};

// modify one song by id
const modifySong = (req, res, next) => {
  if (!req.loggedUser.is_artista){
    return res.status(403).json({success:false, message:'Not Authorized'});
  }

  // prendo id della canzone dal corpo della richiesta
  let song = req.body.song;
  let song_id = song.id;

  // id dell'artista presente nel token
  let token_user_id = req.loggedUser.id;
  // confronto con l'id dell'artista della canzone
  Song.findOne({id: song_id}, function(err, song){
    if (err) return res.json({success: false, message: "Song not found, is the id correct?"});
    if (token_user_id != song.artist){
      // qualcuno sta cercando di modificare la canzone di un altro
      return res.json({success: false, message: "Not Authorized"});
    }

    // qui tutto regolare, posso modificare la canzone
    Song.findByIdAndUpdate(song_id, song, function(err){
      if (err) return res.json({success: false, message: "Uncatched error"});
      return res.json({success: true, message: "Song modified"});
    });
  });
};


// delete one song by id

const deleteSong = (req, res, next) => {
  // solo un artista può eliminare una sua canzone
  if (!req.loggedUser.is_artista){
    return res.status(403).json({success:false, message:'Not Authorized'});
  }

  // prendo id della canzone dal corpo della richiesta
  let song_id = req.params.song_id;
  let token_user_id = req.loggedUser.id;

  Song.findOne({id: song_id}, function(err, song){
    if (err) return res.json({success: false, message: "Song not found, is the id correct?"});
    if (token_user_id != song.artist){
      // qualcuno sta cercando di modificare la canzone di un altro
      return res.json({success: false, message: "Not Authorized"});
    }

    // qui tutto regolare, posso modificare la canzone
    Song.findByIdAndRemove(song_id, song, function(err){
      if (err) return res.json({success: false, message: "Uncatched error"});
      return res.json({success: true, message: "Song deleted"});
    });
  });
};


// utils
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

module.exports = {
  getSongs,
  getSongsByHint,
  newSong,
  deleteSongs,
  getSong,
  modifySong,
  deleteSong
};
