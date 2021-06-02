const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);


describe('reaction test', () =>{

	let findArticleSpy;
	let findUserSpy;
	let findOneSpy;
	let findSpy;

	beforeAll( () => {
		const Article = require("../../models/Article");
		const Reaction = require("../../models/Reaction");
		const User = require("../../models/User");

		findArticleSpy = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{

			if(criterias.author == "DanteAlighieri" && criterias.id == 1){

				return {
					id : 1,
					author : "DanteAlighieri",
					title : "La divina commedia",
					summary : "inferno",
					text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
					tags: "poema epico, italiano"
				};

			} else if (criterias.author == "AlessandroManzoni" && criterias.id == 1){
				
				return {
					id: 1,
					author : "AlessandroManzoni",
					title : "Promessi Sposi",
					summary : "..",
					text : "Quel ramo del lago di Como, che volge a mezzogiorno",
					tags: "romanzo, italiano"
				};

			}

			return null;
			
		});

		findUserSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
			if(criterias.username == "dantealighieri"){
				
				return {
					name: "Dante",
					surname: "Alighieri",
					email: "dante.alighieri@loremipsum.it",
					password: "12345678",
					username: "dantealighieri"
				};

			} else if (criterias.username == "giovannipascoli"){
				
				return {
					name: "Giovanni",
					surname: "Pascoli",
					email: "giovanni.pascoli@loremipsum.it",
					password: "12345678",
					username: "giovannipascoli"
				};

			} else if (criterias.username == "alessandromanzoni"){
				
				return {
					name: "Alessandro",
					surname: "Manzoni",
					email: "alessandro.manzoni@loremipsum.it",
					password: "12345678",
					username: "alessandromanzoni"
				};

			}
			
			return null;
			
		});

		findOneSpy = jest.spyOn(Reaction, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username = "dantealighieri" && criterias.id == 1 && criterias.author == "DanteAlighieri"){
				
				return {
					id : 1,
					author : "DanteAlighieri",
					username : "dantealighieri",
					reaction: 3
				};

			}
			
			return null;
			
		});

		findSpy = jest.spyOn(Reaction, 'find').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
				
				return [{
					id : 1,
					author : "DanteAlighieri",
					username : "dantealighieri",
					reaction: 3
				},{
					id : 1,
					author : "AlessandroManzoni",
					username : "dantealighieri",
					reaction: 3
				}
				];

			}
			
			return null;
			
		});

	});

	afterAll( async () =>{
		findArticleSpy.mockRestore();
		findUserSpy.mockRestore();
		findOneSpy.mockRestore();
		findSpy.mockRestore();
	});

	//--------------------------------------------------------------------------
	test('POST /reaction missing data', async done =>{

		const response = await request
		.post('/reaction')
		.set('Accept', 'application/json')
		.send({author : "AlessandroManzoni",});
		
		expect(response.statusCode).toBe(400);
		done();
	});

	test('POST /reaction missing User or Article', async done =>{

		const response = await request
		.post('/reaction')
		.set('Accept', 'application/json')
		.send({ id : 1,
			author : "dantealighieri",
			username : "Username",
			reaction: 3
		});

		expect(response.statusCode).toBe(404);
		done();
	});

	test('POST /reaction already exist', async done =>{

		const response = await request
		.post('/reaction')
		.set('Accept', 'application/json')
		.send({ id : 1,
			author : "DanteAlighieri",
			username : "dantealighieri",
			reaction: 3
		});
		
		expect(response.statusCode).toBe(403);
		done();
	});

	test('POST /reaction valid data', async done =>{

		const response = await request
		.post('/reaction')
		.set('Accept', 'application/json')
		.send({ id : 1,
			author : "AlessandroManzoni",
			username : "giovannipascoli",
			reaction: 3
		});

		expect(response.statusCode).toBe(201);
		done();
	});


	test('GET /reaction/:id/:author, success', async done =>{
		
		const response = await request.get('/reaction/1/DanteAlighieri');
		let reaction = {
			id : 1,
			author : "DanteAlighieri",
			username : "dantealighieri",
			reaction : 3
		};

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(reaction.id);
		expect(response.body.author).toBe(reaction.author);
		expect(response.body.username).toBe(reaction.username);
		expect(response.body.reaction).toBe(reaction.reaction);
		done();
	});

	test('GET /reaction/:id/:author, missing article', async done =>{
		
		const response = await request.get('/reaction/3/AlessandroManzoni');

		expect(response.statusCode).toBe(404);
		done();
	});

	test('GET /reaction/:id/:author, missing reaction', async done =>{
		
		const response = await request.get('/reaction/1/AlessandroManzoni');

		expect(response.statusCode).toBe(404);
		done();
	});

	test('GET /reaction/:username, success', async done =>{
		
		const response = await request.get('/reaction/dantealighieri');

		let reaction = [{
			id : 1,
			author : "DanteAlighieri",
			username : "dantealighieri",
			reaction: 3
		},{
			id : 1,
			author : "AlessandroManzoni",
			username : "dantealighieri",
			reaction: 3
		}
		];

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(reaction.id);
		expect(response.body.author).toBe(reaction.author);
		expect(response.body.username).toBe(reaction.username);
		expect(response.body.reaction).toBe(reaction.reaction);
		done();
	});

	test('GET /reaction/:username, missing user', async done =>{
		
		const response = await request.get('/reaction/Username');

		expect(response.statusCode).toBe(404);
		done();
	});

	test('GET /reaction/:username, missing reaction', async done =>{
		
		const response = await request.get('/reaction/alessandromanzoni');

		expect(response.statusCode).toBe(404);
		done();
	});

});
