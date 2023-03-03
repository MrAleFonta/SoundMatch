const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
var bodyParser = require('body-parser')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


var http = require('http').Server(app);
var io = require('socket.io')(http);


const uri = process.env.PRIVATE_KEY;

try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        uri,
        {dbName: 'SoundMatch',
         useNewUrlParser: true,
         useUnifiedTopology: true
        },
        () => console.log("Mongoose is connected"),
    );
} catch (e) {
    console.log("could not connect");
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));



const songRoutes = require('./routes/song'); //to import the routes/song.js
const authRoutes = require('./routes/auth'); //to import the routes/auth.js
const chatRoutes = require('./routes/chat'); //to import the routes/chat.js
const collabRoutes = require('./routes/collab'); //to import the routes/collab.js
const collabChatRoutes = require('./routes/collab_chat.js'); //to import the routes/collab_chat.js
const searchRoutes = require('./routes/search.js'); //to import the routes/collab_chat.js
const genreRoutes = require('./routes/genre.js'); //to import the routes/genre.js


// allow CORS for all requests
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

// routing for API
//app.use(forms.array()); 

app.use('/api/song', songRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/collab_chat', collabChatRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/genre', genreRoutes);

// routing for static pages
app.use(express.static('public'));

// per la chat globale
io.on('connection', () =>{
    console.log('a user is connected')
})


var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});
