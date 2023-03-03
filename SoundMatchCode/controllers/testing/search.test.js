const request = require('supertest')
const app = require('../../index')
const mongoose = require('mongoose')
const expect = require('chai').expect
const jwt = require('jsonwebtoken')


describe("Test API search", () => {

    jest.setTimeout(100000)

    const baseUrl = 'http://localhost:3000/api/search'

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

    it ('should find all artists', async () => {
        request(baseUrl)
        .get('/artists')
        .send({
            token: token,
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('x-access-token', token)
        .end(function(err,res) {
            expect(res.body).toEqual({success: true, artists: artists})
            if(err) {
                throw err
            }
        })
    })
})
