const request = require('supertest')
const app = require('../../index')
const mongoose = require('mongoose')
const song = require('../../controllers/song')
const auth = require('../../controllers/auth')
const schema = require('../../models/song-model')
const { exists } = require('../../models/song-model')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const tok = require('../token')

    jest.setTimeout(100000)

    const baseUrl = 'http://localhost:3000/api/genre'
    const TOKEN_EXPIRATION = 60*60*24;
    var payload = {email: "gigi@gigi.gigi", id: "63eb41487c2b82e715318a22", is_artista: true}
    var options = {expiresIn: TOKEN_EXPIRATION}
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options)


    beforeEach(async () => {
        await mongoose.connect(process.env.PRIVATE_KEY);
    });
    
    afterEach(async () => {
        await mongoose.connection.close();
    });

    describe('genre', () => {
        it ('should correctly add genres to an artist', async () => {
            request(baseUrl)
        .post('')
        .send({
            genre: 'genre',
            token: token
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'bearer', + token)
        .end(function(err,res) {
            expect(res.body.success).to.be.equal(true)
            if(err) {
                throw err
            }
        })
        })
    })