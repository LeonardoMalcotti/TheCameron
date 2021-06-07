const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);
require("dotenv").config();


describe('Reaction', () =>{

	let findArticleSpy;
	let findUserSpy;
	let findOneSpy;
	let findSpy;

	let users = [{
		name: "Dante",
		surname: "Alighieri",
		email: "dante.alighieri@loremipsum.it",
		password: "12345678",
		username: "dantealighieri"
	},{
		name: "Giovanni",
		surname: "Pascoli",
		email: "giovanni.pascoli@loremipsum.it",
		password: "12345678",
		username: "giovannipascoli"
	},{
		name: "Alessandro",
		surname: "Manzoni",
		email: "alessandro.manzoni@loremipsum.it",
		password: "12345678",
		username: "alessandromanzoni"
	}];


	let articles = [{
		id : 1,
		author : "dantealighieri",
		title : "La divina commedia",
		summary : "inferno",
		text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
		tags: "poema epico, italiano"
	},{
		id: 1,
		author : "alessandromanzoni",
		title : "Promessi Sposi",
		summary : "..",
		text : "Quel ramo del lago di Como, che volge a mezzogiorno",
		tags: "romanzo, italiano"
	},{
		id: 2,
		author : "alessandromanzoni",
		title : "Promessi Sposi, la rivincita",
		summary : "..",
		text : "Quel ramo del lago di Como, che volge a mezzogiorno",
		tags: "romanzo, italiano"
	}];


	let reactions = [{
		id : 1,
		author : "dantealighieri",
		username : "alessandromanzoni",
		reaction: 3
	},{
		id : 1,
		author : "dantealighieri",
		username : "giovannipascoli",
		reaction: 3
	},{
		id : 1,
		author : "alessandromanzoni",
		username : "dantealighieri",
		reaction: 3
	}];


	beforeAll( () => {

		const Article = require("../../models/Article");
		const Reaction = require("../../models/Reaction");
		const User = require("../../models/User");

		findArticleSpy = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{

			if(criterias.author == "dantealighieri" && criterias.id == 1){
				return articles[0];
			} 

			if (criterias.author == "alessandromanzoni" && criterias.id == 1){
				return articles[1];
			}

			if (criterias.author == "alessandromanzoni" && criterias.id == 2){
				return articles[2];
			}

			return null;
		});

		findUserSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
				return users[0];
			}

			if (criterias.username == "giovannipascoli"){
				return users[1];
			}

			if (criterias.username == "alessandromanzoni"){
				return users[2];
			}
			
			return null;
		});

		findOneSpy = jest.spyOn(Reaction, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username = "alessandromanzoni" && criterias.id == 1 && criterias.author == "dantealighieri"){
				return reactions[0];
			}
			
			if(criterias.username = "giovannipascoli" && criterias.id == 1 && criterias.author == "dantealighieri"){
				return reactions[1];
			}

			if(criterias.username = "dantealighieri" && criterias.id == 1 && criterias.author == "alessandromanzoni"){
				return reactions[2];
			}
			
			return null;
		});

		findSpy = jest.spyOn(Reaction, 'find').mockImplementation((criterias) =>{
			
			if(criterias.author == "dantealighieri" && criterias.id == 1){
				return [reactions[0],reactions[1]];
			}

			if(criterias.author == "alessandromanzoni" && criterias.id == 1){
				return [reactions[2]];
			}

			if(criterias.username == "dantealighieri"){
				return [reactions[3]];
			}
			
			return [];
			
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

		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "dantealighieri",
          		password: "12345678",
        	})).body.token;

		const response = await request
			.post('/reaction')
			.set('Accept', 'application/json')
			.set('token',token)
			.send({author : "alessandromanzoni",});
		
		expect(response.statusCode).toBe(400);
		done();
	});


	test('POST /reaction missing User or Article', async done =>{

		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "dantealighieri",
          		password: "12345678",
        	})).body.token;

		const response = await request
			.post('/reaction')
			.set('Accept', 'application/json')
			.set('token',token)
			.send({ 
				id : 1,
				author : "dantealighieri",
				username : "Username",
				reaction: 3
			});

		expect(response.statusCode).toBe(404);
		done();
	});


	test('POST /reaction already exist', async done =>{

		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "dantealighieri",
          		password: "12345678",
        	})).body.token;

		const response = await request
			.post('/reaction')
			.set('Accept', 'application/json')
			.set('token',token)
			.send({ 
				id : 1,
				author : "alessandromanzoni",
				username : "dantealighieri",
				reaction: 3
			});
		
		expect(response.statusCode).toBe(403);
		done();
	});


	test('POST /reaction valid data', async done =>{

		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "giovannipascoli",
          		password: "12345678",
        	})).body.token;

		const response = await request
			.post('/reaction')
			.set('Accept', 'application/json')
			.set('token',token)
			.send({ 
				id : 2,
				author : "alessandromanzoni",
				username : "giovannipascoli",
				reaction: 3
			});

		expect(response.statusCode).toBe(201);
		done();
	});


	test('GET /reaction/:id/:author, success', async done =>{
		
		const response = await request.get('/reaction/1/dantealighieri');

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(2);
		done();
	});


	test('GET /reaction/:id/:author, missing article', async done =>{
		
		const response = await request.get('/reaction/3/alessandromanzoni');

		expect(response.statusCode).toBe(404);
		done();
	});


	test('GET /reaction/:id/:author, missing reaction', async done =>{
		
		const response = await request.get('/reaction/2/alessandromanzoni');

		expect(response.statusCode).toBe(404);
		done();
	});


	test('GET /reaction/:username, success', async done =>{
		
		const response = await request.get('/reaction/dantealighieri');

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(1);
		done();
	});


	test('GET /reaction/:username, missing user', async done =>{
		
		const response = await request.get('/reaction/Username');

		expect(response.statusCode).toBe(404);
		done();
	});

});
