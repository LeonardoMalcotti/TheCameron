const request = require('supertest');
const app = require('./app');

describe('POST /user', () =>{

    let userSpy;

    beforeAll( () =>{
        const User = require("../user");
        userSpy = jest.spyOn(User, 'findOne').mockImpementation((criterias) =>{
            return {
                "name": "Dante",  
                "surname": "Alighieri", 
                "email": "dante.alighieri@loremipsum.it", 
                "password": "12345678", 
                "username": "dantealighieri"
            };
        });
    });

    afterAll( async () =>{
        userSpy.mockRestore();
    });

    test('POST /user missing data', async () =>{
        expect.assertions(1);
        const response = await request(app).post('/user');
        expect(response.statusCode).toBe(400);
    });

    test('POST /user valid data', async () =>{
        expect.assertions(1);
        const response = await request(app)
            .post('/user')
            .set('Accept', 'application/json')
            .send({"name": "Filippo",  
                   "surname": "Fanton", 
                   "email": "filippo.fanton@studenti.unitn.it", 
                   "password": "12345678", 
                   "username": "filippofanton"});
        expect(response.statusCode).toBe(201);
    });

    test('POST /user invalid data, already existing user', async () =>{
        expect.assertions(1);
        const response = await request(app)
            .post()
            .set('Accept', 'application/json')
            .send({"name": "Dante",  
                   "surname": "Alighieri", 
                   "email": "dante.alighieri@loremipsum.it", 
                   "password": "12345678", 
                   "username": "dantealighieri"});
        expect(response.statusCode).toBe(403);
    });
});