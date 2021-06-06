const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);


describe('user test', () =>{

	//mock function per il metodo find in post /user/username/subscribe
	let findSpyUser;
	let findSpySub;
  	//mock function per il metodo find in post /user
  	let findSpy;
  
  	beforeAll( () => {
  		const User = require("../../models/User");
  		const Subscription = require("../../models/Subscription");

  		findSpy = jest.spyOn(User, 'find').mockImplementation((criterias) =>{

  			if(criterias.username == "dantealighieri"){
  				
  				return [{
  					name: "Dante",  
  					surname: "Alighieri", 
  					email: "dante.alighieri@loremipsum.it", 
  					password: "12345678", 
  					username: "dantealighieri"
  				}];

  			} 
  			
  			return [];
  		});

  		findSpyUser = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
  			
  			if(criterias.username == "dantealighieri"){
  				
  				return {
  					name: "Dante",
  					surname: "Alighieri",
  					email: "dante.alighieri@loremipsum.it",
  					password: "12345678",
  					username: "dantealighieri"
  				};

  			} else if(criterias.username == "giovannipascoli"){
  				
  				return {
  					name: "Giovanni",
  					surname: "Pascoli",
  					email: "giovanni.pascoli@loremipsum.it",
  					password: "12345678",
  					username: "giovannipascoli"
  				}

  			}
  			
  			return null;
  		});

  		findSpySub = jest.spyOn(Subscription, 'findOne').mockImplementation((criterias) =>{
  			
  			if(criterias.username == "dantealighieri"){
  				
  				return {
  					username: "dantealighieri",
  					dateSubscription: "1/04/2021"
  				};

  			}
  			
  			return null;
  		});

  		findSpySub = jest.spyOn(Subscription, 'deleteOne').mockImplementation((criterias) =>{
  			
  			if(criterias.username == "dantealighieri"){
  				return "true";
  			}
  			
  			return null;
  		});

  	});

  	afterAll( async () =>{
  		findSpyUser.mockRestore();
  		findSpySub.mockRestore();
  		findSpy.mockRestore();
  	});

	//Test User
	//--------------------------------------------------------------------------

	test('POST /user, missing data', async done =>{
		
		const response = await request.post('/user');
		
		expect(response.statusCode).toBe(400);
		done();
	});


	test('GET /user/:username, success', async done =>{
		
		const response = await request.get('/user/dantealighieri');
		
		expect(response.statusCode).toBe(200);
		done();
	});


	test('POST /user, valid data', async done =>{

		const response = await request
			.post('/user')
			.set('Accept', 'application/json')
			.send({
				name: "Dante",  
				surname: "Alighieri", 
				email: "dante.alighieri@email.it", 
				password: "12345678", 
				username: "mock_dantealighieri"
			});

		expect(response.statusCode).toBe(201);
		done();
	});


	test('POST /user, already existing user', async done =>{

		const response = await request
			.post('/user')
			.set('Accept', 'application/json')
			.send({
				name: "Dante",  
				surname: "Alighieri", 
				email: "dante.alighieri@loremipsum.it", 
				password: "12345678", 
				username: "dantealighieri"
			});

		expect(response.statusCode).toBe(403);
		done();
	});
	
	//Test Subscription
	//--------------------------------------------------------------------------

	test('POST /user/:username/subscription, missing data', async done =>{
		
		const response = await request
			.post('/user/dantealighieri/subscription')
			.set('Accept', 'application/json');

		expect(response.statusCode).toBe(400);
		done();
	});

	test('POST /user/:username/subscription, valid data', async done =>{
		
		const response = await request
			.post('/user/giovannipascoli/subscription')
			.set('Accept', 'application/json')
			.send({"dateSubscription": "12/05/2020"});

		expect(response.statusCode).toBe(201);
		done();
	});

	test('POST /user/:username/subscription, subscription already exists', async done =>{
		
		const response = await request
			.post('/user/dantealighieri/subscription')
			.set('Accept', 'application/json')
			.send({"dateSubscription": "1/04/2021"});

		expect(response.statusCode).toBe(404);
		done();
	});
	
	test('POST /user/:username/subscription, user not exist', async done =>{
		
		const response = await request
			.post('/user/loremipsum/subscription')
			.set('Accept', 'application/json');

		expect(response.statusCode).toBe(404);
		done();
	});
	
	test('GET /user/:username/subscription, subscription not exist', async done =>{
		
		const response = await request.get('/user/loremipsum/subscription');
		
		expect(response.statusCode).toBe(404);
		done();
	});

	test('GET /user/:username/subscription, succes', async done =>{
		
		const response = await request.get('/user/dantealighieri/subscription');
		
		expect(response.statusCode).toBe(200);
		expect(response.body.username).toBe('dantealighieri');
		expect(response.body.dateSubscription).toBe('1/04/2021');
		done();
	});

	test('DELETE /user/:username/subscription, succes', async done =>{
		
		const response = await request.delete("/user/dantealighieri/subscription");

		expect(response.statusCode).toBe(204);
		done();
	});

});
