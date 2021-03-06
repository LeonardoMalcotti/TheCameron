const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);
require("dotenv").config();


describe('Login', () =>{

	//mock function per il metodo findOne in post /login
	let findOneSpy;

	beforeAll( () => {

		const User = require("../../models/User");
	
		findOneSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
			if(criterias.username == "dantealighieri"){

				return {
					name: "Dante",  
					surname: "Alighieri", 
					email: "dante.alighieri@loremipsum.it", 
					password: "12345678", 
					username: "dantealighieri"
				};

			}
			
			return null;
		});
	});

	afterAll( async () =>{
		findOneSpy.mockRestore();
	});

	//--------------------------------------------------------------------------


	test('POST /login missing all data', async done =>{

		const response = await request.post('/login');

		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /login missing username', async done =>{
		
		const response = await request
			.post('/login')
			.set('Accept', 'application/json')
			.send({password: "12345678"});
			
		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /login missing password', async done =>{
		
		const response = await request
			.post('/login')
			.set('Accept', 'application/json')
			.send({username: "dantealighieri"});
			
		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /login valid data', async done =>{
		//expect.assertions(3);
		const response = await request
			.post('/login')
			.set('Accept', 'application/json')
			.send({
				username: "dantealighieri",
				password: "12345678"
			});

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.token).toBeDefined();
		done();
	});
	

	test('POST /login wrong password', async done =>{

		const response = await request
			.post('/login')
			.set('Accept', 'application/json')
			.send({
				username: "dantealighieri",
				password: "87654321"
			});
			
		expect(response.statusCode).toBe(403);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe("wrong password");
		done();
	});


	test('POST /login wrong username', async done =>{

		const response = await request
			.post('/login')
			.set('Accept', 'application/json')
			.send({
				username: "giovanniboccaccio",
				password: "123456789"
			});
			
		expect(response.statusCode).toBe(403);
		expect(response.body.success).toBe(false);
		done();
	});
});
