const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

	
describe('article test', () =>{
  	let findOneSpy;
  	let findSpy;
  	let filterSpy;
  	beforeAll( () => {
		const Article = require("../../models/Article");
		findSpy = jest.spyOn(Article, 'find').mockImplementation((criterias) =>{
	  	let pool =[
			{
		  		id: "1", 
		  		author: "tizio", 
		  		title: "Breve guida su come testare con jest", 
		  		summary: "summ",
		  		date: "1"
			},
			{
		  		id: "2", 
		  		author: "tizio", 
		  		title: "Come utilizzare jEsT e spyOn al meglio", 
		  		summary: "summ",
		  		date: "2"
			},
			{
		  		id: "3", 
		  		author: "tizio", 
		  		title: "Altro titolo con jestAll'interno", 
		  		summary: "summ",
		  		date: "3"
			},
			{
		  		id: "4", 
		  		author: "tizio", 
		  		title: "Altro titolo", 
		  		summary: "summ",
		  		date: "4"
			},
			{
		  		id: "5", 
		  		author: "tizio", 
		  		title: "Qualcos'altro a caso", 
		  		summary: "summ",
		  		date: "5"
			},
	  	];

	  	return pool;
	});
	
	findOneSpy = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{
	  	if(criterias.author == "Dante Alighieri" && criterias.id == 1){

			return {
		  		id : 1,
		  		author : "Dante Alighieri",
		  		title : "La divina commedia",
		  		summary : "inferno",
		  		text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
		  		tags: "poema epico, italiano"
			};

	  	} else if (criterias.author == "Alessandro Manzoni" && criterias.id == 1){
		
			return {
				id: 1,
				author : "Alessandro Manzoni",
				title : "Promessi Sposi",
				summary : "..",
				text : "Quel ramo del lago di Como, che volge a mezzogiorno",
				tags: "romanzo, italiano"
			};

	  	} 
		
		return null;
	 	
	});
/*
	filterSpy = jest.fn(Article, 'filter').mockImplementation((criterias) =>{
	  	if(criterias.author == "Alessandro Manzoni"){
			return [{
		  		id: 1,
		  		author : "Alessandro Manzoni",
		  		title : "Promessi Sposi",
		  		summary : "..",
		  		text : "Quel ramo del lago di Como, che volge a mezzogiorno",
		  		tags: "romanzo, italiano"
			}];
	  }
	});*/
 	 });

  	afterAll( async () =>{
	  	findSpy.mockRestore();
	  	filterSpy.mockRestore();
	  	findOneSpy.mockRestore();
  	});

  	// Tests --------------------------------------------------------------------------


  	test('GET /article/search/:title, title = jest', async done =>{
		const response = await request
	  		.get('/article/search/jest')
	  		.set('Accept', 'application/json')
	  		.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(3);
		done();
  	});

  	test('GET /article/search/:title, title = altro/Altro', async done =>{
		const response1 = await request
	  		.get('/article/search/altro')
	  		.set('Accept', 'application/json')
	  		.send();

		const response2 = await request
	  		.get('/article/search/Altro')
	  		.set('Accept', 'application/json')
	  		.send();

		expect(response1.statusCode).toBe(200);
		expect(response2.statusCode).toBe(200);
		expect(response1.body.length).toBe(response2.body.length);
		done();
  	});

  	test('GET /article/search/:title, title = ', async done =>{
		const response = await request
	  		.get('/article/search/ ')
	  		.set('Accept', 'application/json')
	  		.send();

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(5);
		done();
  	});

  	test('GET /Article/:id/:author, success', async done =>{
		const response = await request.get('/article/1/Dante Alighieri');
		let article = {
			id : 1,
			author : "Dante Alighieri",
			title : "La divina commedia",
			summary : "inferno",
			text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
			tags: "poema epico, italiano"
		};

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(article.id);
		expect(response.body.author).toBe(article.author);
		expect(response.body.title).toBe(article.title);
		expect(response.body.summary).toBe(article.summary);
		expect(response.body.text).toBe(article.text);
		expect(response.body.tags).toBe(article.tags);
		done();
  	});

  	test('GET /Article/:id/:author, missing article', async done =>{
		const response = await request.get('/user/3/Alessandro Manzoni');
		expect(response.statusCode).toBe(404);
		done();
  	});

  	test('POST /article missing data', async done =>{
		const response = await request
	  		.post('/article')
	  		.set('Accept', 'application/json')
	  		.send({
				author : "Alessandro Manzoni",
				title : "Promessi Sposi",
	  		});
	
		expect(response.statusCode).toBe(400);
		done();
	});

  
	test('POST /article valid data', async done =>{
		const response = await request
	  		.post('/article')
	  		.set('Accept', 'application/json')
	  		.send({
				author : "Alessandro Manzoni",
				title : "Promessi Sposi",
				summary : "..",
				text : "Quel ramo del lago di Como, che volge a mezzogiorno",
				tags: ["romanzo, italiano"],
				restricted: 'false',
			});
	
		expect(response.statusCode).toBe(201);
		done();
  	});
  
  	test('GET /article/:author, success', async done =>{
		const response = await request.get('/article/tizio');

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(5);
		done();
  	});

  	test('GET /article/:author, missing article', async done =>{
		const response = await request.get('/article/Username');
		
		expect(response.statusCode).toBe(404);
		done();
  	});
});


