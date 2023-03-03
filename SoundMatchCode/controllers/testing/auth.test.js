const request = require('supertest')
const app = require('../../index')
const mongoose = require('mongoose')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')

describe("Test API auth", () => {

    jest.setTimeout(10000)

    const baseUrl = 'http://localhost:3000/api/auth'

    beforeEach(async () => {
        await mongoose.connect(process.env.PRIVATE_KEY);
      });
      
      afterAll(async () => {
        await mongoose.connection.close();
      });

    it('should succesfully create a user', async()=> {
        request(baseUrl)
            .post('/registration')
            .send({
                nome_utente: 'Gigi',
                email: 'gigi@gigi.gigi',
                password: 'Gigi1!',
                is_artista: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.token).not.to.be.null
                expect(res.body).toEqual({ message: 'Success, user saved' });
                if(err) {
                    throw err
                }
            })
    })
    it('should succesfully login', async()=> {
        request(baseUrl)
            .post('/login')
            .send({
                email: 'gigi@gigi.gigi',
                password: 'Gigi1!',
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.token).not.to.be.null
                expect(res.body).toEqual({ message: 'Token generated' });
                if(err) {
                    throw err
                }
            })
    })
    it('should give error because of wrong password', async()=> {
        request(baseUrl)
            .post('/registration')
            .send({
                nome_utente: 'Gigi',
                email: 'gigi@gigi.gigi',
                password: 'Gigi12!',
                is_artista: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.success).to.be.false
                expect(res.body).toEqual({ message: 'Wrong password' });
                if(err) {
                    throw err
                }
            })
    })
    it('should give error because of missing username', async()=> {
        request(baseUrl)
            .post('/registration')
            .send({
                nome_utente: '',
                email: 'gigi@gigi.gigi',
                password: 'Gigi1!',
                is_artista: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(400)
                expect(res.body).toEqual({ message: 'Error, give all the information' });
                if(err) {
                    throw err
                }
            })
    })
    it('should give error because of missing password', async()=> {
        request(baseUrl)
            .post('/registration')
            .send({
                nome_utente: 'Gigi',
                email: 'gigi@gigi.gigi',
                password: '',
                is_artista: true
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err,res) {
                expect(res.statusCode).to.be.equal(400)
                expect(res.body).toEqual({ message: 'Error, give all the information' });
                if(err) {
                    throw err
                }
            })
    })
})