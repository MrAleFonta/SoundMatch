const request = require('supertest')
const app = require('../../index')
const mongoose = require('mongoose')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')

describe("Test API chat", () => {

    jest.setTimeout(100000)

    const baseUrl = 'http://localhost:3000/api/chat'

    const TOKEN_EXPIRATION = 60*60*24;
    var payload = {email: "gigi@gigi.gigi", id: "63eb553c7ba12105363de736", is_artista: true}
    var options = {expiresIn: TOKEN_EXPIRATION}
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options)

    beforeEach(async () => {
        await mongoose.connect(process.env.PRIVATE_KEY);
    });
    
    afterEach(async () => {
        await mongoose.connection.close();
    });

    it('should succesfully get all messages from a community', async()=> {
        request(baseUrl)
            .get('/chat_id/:chat_id')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .send({
                chat_id: '2',
                token: token
            })
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                if(err) {
                    throw err
                }
            })
    })

    it('should succesfully get all messages from a user', async()=> {
        request(baseUrl)
            .get('/chat_id/:chat_id/:nome_utente')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .send({chat_id: '2', nome_utente: 'Gigi', token: token})
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                if(err) {
                    throw err
                }
            })
    })

    it('should not send a message because of missing message', async()=> {
        request(baseUrl)
            .post('/chat_id/:chat_id')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .send({
                chat_id: '2',
                nome_utente: 'Gigi',
                token: token
            })
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(500)
                if(err) {
                    throw err
                }
            })
    })

    it('should succesfully send a message', async()=> {
        request(baseUrl)
            .post('/chat_id/:chat_id')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .send({
                chat_id: '2',
                message: 'prova',
                token: token
            })
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                if(err) {
                    throw err
                }
            })
    })

    it('should succesfully delete all messages from the logged-in user', async()=> {
        request(baseUrl)
            .delete('/chat_id/:chat_id')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .send({
                chat_id: '2',
                token: token
            })
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                if(err) {
                    throw err
                }
            })
    })

    it('should succesfully delete a specific message', async()=> {
        request(baseUrl)
            .delete('/message_id/:message_id')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .send({
                message_id: '63a1a54f19ff38bcad22b794',
                token: token
            })
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                if(err) {
                    throw err
                }
            })
    })
})