const request = require('supertest')
const app = require('../../index')
const mongoose = require('mongoose')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')


describe("Test API collab", () => {

    jest.setTimeout(100000)

    const baseUrl = 'http://localhost:3000/api/collab'

    const TOKEN_EXPIRATION = 60*60*24;
    var payload = {email: "gigi@gigi.gigi", id: "63eb553c7ba12105363de736", is_artista: true}
    var options = {expiresIn: TOKEN_EXPIRATION}
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options)

    beforeEach(async () => {
        await mongoose.connect(process.env.PRIVATE_KEY);
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it ('should not send a collab request because receiver is not an artist', async () => {
        request(baseUrl)
        .get('/user_id/:user_id')
        .send({
            token: token,
            user_id: '63ebad055a80a0f212d8e123'
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('x-access-token', token)
        .end(function(err,res) {
            expect(res.success).to.be.false
            expect(res.body).toEqual({message: 'Non puoi collaborare con un utente non artista'})
            if(err) {
                throw err
            }
        })
    })

    it ('should send a collab request', async () => {
        request(baseUrl)
        .get('/user_id/:user_id')
        .send({
            token: token,
            user_id: '638db3ddc985e85dbafc7ccb'
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('x-access-token', token)
        .end(function(err,res) {
            expect(res.success).to.be.true
            expect(res.body).toEqual({message: 'Collab request created'})
            if(err) {
                throw err
            }
        })
    })

    it ('should accept a collab request', async () => {
        request(baseUrl)
        .get('/collab_id/:collab_id')
        .send({
            token: token,
            collab_id: '638db3ddc985e85dbafc7ccb'
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('x-access-token', token)
        .end(function(err,res) {
            expect(res.success).to.be.true
            expect(res.body).toEqual({message: 'Collaborazione accettata'})
            if(err) {
                throw err
            }
        })
    })

    it ('should decline a collab request', async () => {
        request(baseUrl)
        .delete('/collab_id/:collab_id')
        .send({
            token: token,
            collab_id: '638db3ddc985e85dbafc7ccb'
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('x-access-token', token)
        .end(function(err,res) {
            expect(res.success).to.be.true
            expect(res.body).toEqual({message: 'Collaborazione rifiutata'})
            if(err) {
                throw err
            }
        })
    })

    it ('should get all collabs', async () => {
        request(baseUrl)
        .get('')
        .send({
            token: token,
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('x-access-token', token)
        .end(function(err,res) {
            expect(res.success).to.be.true
            if(err) {
                throw err
            }
        })
    })
})
