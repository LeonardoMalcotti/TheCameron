const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);
require("dotenv").config();


describe('Article', () =>{
  	
  	let findOneSpy;
  	let findSpy;
  	let findOneUser;

  	let tags = [{
  		id : 1,
  		name : "italiano"
  	},{
  		id : 2,
  		name : "romanzo"
  	},{
  		id : 3,
  		name : "poema epico"
  	},];

  	let articles = [{
  		id: 1,
  		author : "Alessandro Manzoni",
  		title : "Promessi Sposi",
  		summary : "..",
  		text : "Quel ramo del lago di Como, che volge a mezzogiorno",
  		tags: [1,2]
  	},{
  		id: 1, 
  		author: "tizio", 
  		title: "Breve guida su come testare con jest", 
  		summary: "summ",
  		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  		date: "1",
  		tags: []
  	},{
  		id: 2, 
  		author: "tizio", 
  		title: "Altro titolo con jestAll'interno", 
  		summary: "summ",
  		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  		date: "3",
  		tags: [2]
  	},];

  	beforeAll( () => {

		const Article = require("../../models/Article");
		const User = require("../../models/User");

		findOneSpy = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.author == "tizio" && criterias.id == 1){
				return articles[1];
			} 

			if (criterias.author == "Alessandro Manzoni" && criterias.id == 1){
				return articles[2];
			} 

			return null;

		});

		findSpy = jest.spyOn(Article, 'find').mockImplementation((criterias) => {
			return articles;
		});

		findOneUser = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{

			if(criterias.username == "tizio"){
  				
  				return {
  					name: "tizio",
  					surname: "tizio",
  					email: "tizio.tizio@loremipsum.it",
  					password: "12345678",
  					username: "tizio"
  				};

  			}

  			if(criterias.username == "Alessandro Manzoni"){

  				return {
  					name: "Alessandro",
  					surname: "Manzoni",
  					email: "ale.manz@loremipsum.it",
  					password: "12345678",
  					username: "Alessandro Manzoni"
  				};

  			}

  			return null;
		});
 	});

  	afterAll( async () =>{
	  	findOneUser.mockRestore();
	  	findOneSpy.mockRestore();
	  	findOneSpy.mockRestore();
  	});


  	// Tests --------------------------------------------------------------------------


  	test('GET /article/:id/:author, success', async done =>{
		
		const response = await request.get('/article/1/tizio');

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(articles[1].id);
		expect(response.body.author).toBe(articles[1].author);
		expect(response.body.title).toBe(articles[1].title);
		expect(response.body.summary).toBe(articles[1].summary);
		expect(response.body.text).toBe(articles[1].text);
		expect(response.body.tags).toStrictEqual(articles[1].tags);
		done();
  	});


  	test('GET /article/:id/:author, missing article', async done =>{
		
		const response = await request.get('/article/3/Alessandro Manzoni');
		
		expect(response.statusCode).toBe(404);
		done();
  	});


  	test('POST /article missing data', async done =>{
		
		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "Alessandro Manzoni",
          		password: "12345678",
        	})).body.token;

		const response = await request
	  		.post('/article')
	  		.set('Accept', 'application/json')
	  		.set('token',token)
	  		.send({
				author : "Alessandro Manzoni",
				title : "Promessi Sposi",
	  		});
	
		expect(response.statusCode).toBe(400);
		done();
	});

  
	test('POST /article valid data', async done =>{
		
		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "Alessandro Manzoni",
          		password: "12345678",
        	})).body.token;

		const response = await request
	  		.post('/article')
	  		.set('Accept', 'application/json')
	  		.set('token',token)
	  		.send({
				author : "Alessandro Manzoni",
				title : "Promessi Sposi",
				summary : "..",
				text : "Quel ramo del lago di Como, che volge a mezzogiorno",
				tag: [1,2],
				restricted: 'false',
			});
			
		expect(response.statusCode).toBe(201);
		done();
  	});
  

  	test('GET /article/:author, success', async done =>{
		
		const response = await request.get('/article/tizio');

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(2);
		done();
  	});


  	test('GET /article/:author, missing article', async done =>{
		
		const response = await request.get('/article/Username');

		expect(response.statusCode).toBe(404);
		done();
  	});
});


