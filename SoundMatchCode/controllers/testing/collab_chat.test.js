const request = require('supertest')
const app = require('../../index')
const mongoose = require('mongoose')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')


describe("Test API collab_chat", () => {

    jest.setTimeout(100000)

    const baseUrl = 'http://localhost:3000/api/collab_chat'

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

    it('should succesfully send a message', async()=> {
        request(baseUrl)
            .post('/collab_id/:collab_id')
            .send({
                token: token,
                collab_id: '638db3ddc985e85dbafc7ccb'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body).toEqual({ message: 'Messaggio inviato' });
                if(err) {
                    throw err
                }
            })
    })

    it('should not succesfully send a message because it is not his collab', async()=> {
        request(baseUrl)
            .post('/collab_id/:collab_id')
            .send({
                token: token,
                collab_id: '63ecfec5c36f498b4990a1d8'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.success).to.be.false
                expect(res.body).toEqual({ message: 'Non puoi inviare messaggi in questa collaborazione' });
                if(err) {
                    throw err
                }
            })
    })

    it('should get all collab messages', async()=> {
        request(baseUrl)
            .get('/collab_id/:collab_id')
            .send({
                token: token,
                collab_id: '63ecfec5c36f498b4990a1d8'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.success).to.be.true
                expect(res.body).toEqual({success: true, messagges: chat, my_id: user_id})
                if(err) {
                    throw err
                }
            })
    })

    it('should set all messages of a chat as read', async()=> {
        request(baseUrl)
            .post('/collab_id/:collab_id/set_status/read')
            .send({
                token: token,
                collab_id: '63ecfec5c36f498b4990a1d8'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.success).to.be.true
                expect(res.body).toEqual({success: true, message: "Messaggi impostati come letti"})
                if(err) {
                    throw err
                }
            })
    })

    it('should get all unread messages', async()=> {
        request(baseUrl)
            .get('/collab_id/:collab_id/status/sent')
            .send({
                token: token,
                collab_id: '63ecfec5c36f498b4990a1d8'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.success).to.be.true
                expect(res.body).toEqual({success: true, messagges: chat})
                if(err) {
                    throw err
                }
            })
    })

    it('should delete a message', async()=> {
        request(baseUrl)
            .delete('/message_id/:message_id')
            .send({
                token: token,
                message_id: '639aef3786b6181c1c723bfa'
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.success).to.be.true
                expect(res.body).toEqual({sucess: true, message: "Messaggio eliminato"})
                if(err) {
                    throw err
                }
            })
    })
})
