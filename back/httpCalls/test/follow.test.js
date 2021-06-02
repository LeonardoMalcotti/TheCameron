const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);
//require("dotenv").config();

describe('follow test', () => {
	let SpyUserFindOne;
	let SpyFollowFind;
	let SpyFollowFindOne;


	let mockUsers = [
		{
	        name: "Dante",
	        surname: "Alighieri",
	        email: "dante.alighieri@loremipsum.it",
	        password: "12345678",
	        username: "dantealighieri"
	        },
	        {
	        name : "Beatrice",
	        surname : "Portinari",
	        email: "beatrix9@heaven.it",
	        password: "qwerty",
	        username: "bea"
	        }
	];

	let mockFollows = [
		{
			user : "dantealighieri",
			target : []
		},
		{
			user : "bea",
			target : ["dantealighieri"]
		}
	];

	beforeAll( ()=> {

		const User = require("../../models/User");
		const Follow = require("../../models/Follow");


		SpyUserFindOne = jest.spyOn(User,'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
				return mockUsers[0];
	        }

	        if(criterias.username == "bea"){
	        	return mockUsers[1];
			}

	        return null;
		});

		SpyFollowFindOne = jest.spyOn(Follow,'findOne').mockImplementation((criterias) =>{
			
			if(criterias.user == "dantealighieri"){
				return mockFollows[0];
	        }

	        if(criterias.user == "bea"){
	        	return mockFollows[1];
			}
	        
	        return null;
		});

		SpyFollowFind = jest.spyOn(Follow,'find').mockImplementation((criterias)=>{
			
			return mockFollows;

		});
	});

	afterAll(async () => {
		SpyUserFindOne.mockRestore();
		SpyFollowFind.mockRestore();
		SpyFollowFindOne.mockRestore();
	});


	//tests-------------------------------------------------

	test('POST /followers/follow, no target', async done =>{
		const response = await request
			.post('/followers/follow')
			.send({
				user:"dantealighieri"
			});

		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /followers/follow, no user', async done =>{
		const response = await request
			.post('/followers/follow')
			.send({
				target:"bea"
			});

		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /followers/follow, user non esiste', async done =>{
		const response = await request
			.post('/followers/follow')
			.send({
				user:"npe",
				target:"bea"
			});

		expect(response.statusCode).toBe(404);
		done();
	});



	test('POST /followers/follow, target non esiste', async done =>{
		const response = await request
			.post('/followers/follow')
			.send({
				user:"dantealighieri",
				target:"np"
			});

		expect(response.statusCode).toBe(404);
		done();
	});



	test('POST /followers/follow, target == user', async done =>{
		const response = await request
			.post('/followers/follow')
			.send({
				user:"dantealighieri",
				target:"dantealighieri"
			});

		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /followers/follow, user segue già target', async done =>{
		const response = await request
			.post('/followers/follow')
			.send({
				user:"bea",
				target:"dantealighieri"
			});

		expect(response.statusCode).toBe(400);
		done();
	});

//---------------------------------------------------------------------------------

	test('POST /followers/unfollow, no target', async done =>{
		const response = await request
			.post('/followers/unfollow')
			.send({
				user:"dantealighieri"
			});

		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /followers/unfollow, no user', async done =>{
		const response = await request
			.post('/followers/unfollow')
			.send({
				target:"bea"
			});

		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /followers/unfollow, user non esiste', async done =>{
		const response = await request
			.post('/followers/unfollow')
			.send({
				user:"npe",
				target:"bea"
			});

		expect(response.statusCode).toBe(404);
		done();
	});


	test('POST /followers/unfollow, target non esiste', async done =>{
		const response = await request
			.post('/followers/unfollow')
			.send({
				user:"dantealighieri",
				target:"bea"
			});

		expect(response.statusCode).toBe(404);
		done();
	});


	test('POST /followers/unfollow, user non segue target', async done =>{
		const response = await request
			.post('/followers/unfollow')
			.send({
				user:"bea",
				target:"bea"
			});

		expect(response.statusCode).toBe(400);
		done();
	});

//--------------------------------------------------------------------------------

	test('GET /user/:username/following, success', async done =>{
		const response = await request.get('/followers/user/bea/following');

		expect(response.body.users.length).toBe(1);
		done();
	});

	test('GET /user/:username/followers, success', async done =>{
		const response = await request.get('/followers/user/dantealighieri/followers');
		
		expect(response.body.users.length).toBe(1);
		done();
	});


});

