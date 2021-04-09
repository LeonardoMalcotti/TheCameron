const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);

describe('user test', () =>{

	//mock function per il metodo find in post /user/username/subscribe
    let findSpyUser;
    let findSpySub;

    beforeAll( () => {
        const User = require("../../models/User");
        const Subscription = require("../../models/Subscription");
        
        findSpyUser = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
        	if(criterias.username == "dantealighieri"){
	            return {
	                name: "Dante",  
	                surname: "Alighieri", 
	                email: "dante.alighieri@loremipsum.it", 
	                password: "12345678", 
	                username: "dantealighieri"
	            };
	        } else {
	        	return null;
	        }
        });
        findSpySub = jest.spyOn(Subscription, 'findOne').mockImplementation((criterias) =>{
        	if(criterias.username == "dantealighieri"){
	            return {
                    username: "dantealighieri",
                    dateSubscription: "1/04/2021"
	            };
	        } else {
	        	return null;
	        }
        });
    });

    afterAll( async () =>{
        findSpyUser.mockRestore();
        findSpySub.mockRestore();
    });

    //--------------------------------------------------------------------------

    test('POST /subscription missing data', async done =>{
        const response = await request
        .post('/user/dantealighieri/subscription')
        .set('Accept', 'application/json');

        expect(response.statusCode).toBe(400);

        done();
    });

    test('POST /user not exist', async done =>{
        const response = await request
        .post('/user/loremipsum/subscription')
        .set('Accept', 'application/json');

        expect(response.statusCode).toBe(404);

        done();
    });

    test('POST /subscription already exists', async done =>{
        const response = await request
            .post('/user/dantealighieri/subscription')
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(404);

        done();
    });

    test('POST /user and subscription valid data', async done =>{
        const response = await request
            .post('/user/dantealighieri/subscription')
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(201);

        done();
    });
    test('GET /user not exist', async done =>{
        const response = await request.get('/usernameProva');
        expect(response.statusCode).toBe(404);
        done();
    });

    test('GET /user exist', async done =>{
        const response = await request.get('/dantealighieri');
        let user = {
            name: "Dante",  
            surname: "Alighieri", 
            email: "dante.alighieri@loremipsum.it", 
            password: "12345678", 
            username: "dantealighieri"
        }
        expect(response.statusCode).toBe(200);
        expect(response).toBe(user);
        done();
    });

    test('GET /:username/subscription  sub not exist', async done =>{
        const response = await request.get('/danteAlighieri/subscription');
        expect(response.statusCode).toBe(404);
        done();
    });

    test('GET /:username/subscription succes', async done =>{
        const response = await request.get('/dantealighieri/subscription');
        expect(response.statusCode).toBe(200);
        expect(response).toBe({username: "dantealighieri",
        dateSubscription: "1/04/2021"})
        done();
    });

    test('DELETE /:username/subscription succes', async done =>{
        let response = await request.delete("/dantealighieri/subscription");
		expect(response.status).toBe(204);
        done();
    });


});