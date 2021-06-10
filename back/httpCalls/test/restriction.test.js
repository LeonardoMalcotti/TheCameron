const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);
require("dotenv").config();


describe("Restrizione articoli", () =>{

	let spyFindUser, spyFindSub, spyFindArticle;

	beforeAll( () =>{
		
		const User = require("../../models/User");
		const Subscription = require("../../models/Subscription");
		const Article = require("../../models/Article");
		
		spyFindUser = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
				
				return {
					name: "Dante",  
					surname: "Alighieri",
					username: "dantealighieri",
					password: "12345678", 
					email: "dante.alighieri@loremipsum.it", 
				};

			} else if (criterias.username == "boccaccio"){
				
				return {
					name: "Giovanni",
					surname: "Boccaccio",
					username: "boccaccio",
					password: "987654321",
					email: "gio.boccaccio@loremipsum.it",
				};

			} 
		
			return null;
		});

		spyFindArticle = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{ 
			
			if(criterias.id == "1" && criterias.author == "decamerone"){
				
				return {
					id: "1",  
					author: "decamerone", 
					title: "Lorem Ipsum", 
					summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
					text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
					date: "01012020",
					tags: ["mock"],
					restricted : true,
				};

			} else if (criterias.id=="2" && criterias.author == "decamerone"){
				
				return {
					id: "2",  
					author: "decamerone", 
					title: "Lorem Ipsum2", 
					summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
					text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
					date: "01012020",
					tags: ["mock","mock2"],
					restricted : false,
				};

			}
			
			return null;
		});

		spyFindSub = jest.spyOn(Subscription, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
				
				return {
					username: "dantealighieri",
					dateSubscription: "10102020"
				};

			} 
			return null;
			
		});

	});

	afterAll( async () =>{
		spyFindArticle.mockRestore();
		spyFindSub.mockRestore();
		spyFindUser.mockRestore();
	});


	//Tests----------------------------------------------------------


	// valid user with valid sub, non restricted article 
	test('GET /restricted/article/:id/:author/user/:username, access granted to subbed user', async done =>{
		
		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "dantealighieri",
          		password: "12345678",
        	})).body.token;

		const response = await request.get("/restricted/article/2/decamerone/user/dantealighieri")
			.set('token', token);
		
		expect(response.statusCode).toBe(204);
		done();
	});


	// valid user with valid sub, restricted article 
	test('GET /restricted/article/:id/:author/user/:username, access granted to subbed user, restricted article', async done =>{
		
		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "dantealighieri",
          		password: "12345678",
        	})).body.token;

		const response = await request.get("/restricted/article/1/decamerone/user/dantealighieri")
			.set('token', token);
		
		expect(response.statusCode).toBe(204);
		done();
	});


   	// valid user with no sub, non restricted article 
   	test('GET /restricted/article/:id/:author/user/:username, access granted to non restricted article', async done =>{
   		
   		//recupera il token jwt del login per l'utente
   		const token = (await request.post('/login')
        	.send({
          		username: "boccaccio",
          		password: "987654321",
        	})).body.token;

   		const response = await request.get("/restricted/article/2/decamerone/user/boccaccio")
   			.set('token', token);
   		
   		expect(response.statusCode).toBe(204);
   		done();
   	});


	// valid user with no sub, restricted article     
	test('GET /restricted/article/:id/:author/user/:username, access denied to restricted article', async done =>{
		
		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "boccaccio",
          		password: "987654321",
        	})).body.token;

		const response = await request.get("/restricted/article/1/decamerone/user/boccaccio")
			.set('token', token);
		
		expect(response.statusCode).toBe(403);
		done();
	});


	// non valid username 
	test('GET /restricted/article/:id/:author/user/:username, non valid username', async done =>{
		
		//recupera il token jwt del login per l'utente
		const token = (await request.post('/login')
        	.send({
          		username: "dantealighieri",
          		password: "12345678",
        	})).body.token;

		const response = await request.get("/restricted/article/1/decamerone/user/manzoni")
			.set('token', token);
		
		expect(response.statusCode).toBe(404);
		done();
	});


   	// non vaid article
   	test('GET /restricted/article/:id/:author/user/:username, non valid article', async done =>{
   		
   		//recupera il token jwt del login per l'utente
   		const token = (await request.post('/login')
        	.send({
          		username: "dantealighieri",
          		password: "12345678",
        	})).body.token;

   		const response = await request.get("/restricted/article/2/boccaccio/user/dantealighieri")
   			.set('token', token);
   		
   		expect(response.statusCode).toBe(404);
   		done();
   	});

	//-------------------------------------------------------------

   	// access to article to non registered user
   	test('GET /restricted/article/:id/:author, non registered user non restricted article', async done =>{
   		
   		const response = await request.get("/restricted/article/2/decamerone");
   		
   		expect(response.statusCode).toBe(204);
   		done();
   	});


   	// access denied to article to non registered user
   	test('GET /restricted/article/:id/:author, non registered user restricted article', async done =>{
   		
   		const response = await request.get("/restricted/article/1/decamerone");
   		
   		expect(response.statusCode).toBe(403);
   		done();
   	});

});
