const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);

describe('POST /user/username/subscribe', () =>{

	//mock function per il metodo find in post /user/username/subscribe
    let findSpyUser;
    let findSpySub;


    beforeAll( () => {
        const User = require("../../models/User");
        const Subscription = require("../../models/Subscritpion");
        
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
        expect.assertions(1);
        const response = await request
        .post('/user/username/subscription')
        .set('Accept', 'application/json')
        .send({username: "dantealighieri"})

        expect(response.statusCode).toBe(400);

        done();
    });

    test('POST /user not exist', async done =>{
        expect.assertions(1);
        const response = await request
        .post('/user/username/subscription')
        .set('Accept', 'application/json')
        .send({ username: "loremipsum",
                dateSubscription: "2/04/2021"});

        expect(response.statusCode).toBe(404);

        done();
    });

    test('POST /subscription already exists', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/user/username/subscription')
            .set('Accept', 'application/json')
            .send({ username: "dantealighieri",
            dateSubscription: "1/04/2021"});

        expect(response.statusCode).toBe(404);

        done();
    });

    test('POST /user and subscription valid data', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/user/username/subscription')
            .set('Accept', 'application/json')
            .send({ username: "dantealighieri",
            dateSubscription: "3/04/2021"});

        expect(response.statusCode).toBe(201);

        done();
    });

});