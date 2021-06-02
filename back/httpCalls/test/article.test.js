const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

	
describe('article test', () =>{
  	
  	let findOneSpy;
  	//let filterSpy;

  	let tags = [
  	{
  		id : 1,
  		name : "italiano"
  	},
  	{
  		id : 2,
  		name : "romanzo"
  	},
  	{
  		id : 3,
  		name : "poema epico"
  	},
  	];

  	beforeAll( () => {
		const Article = require("../../models/Article");
		
		findOneSpy = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{
			if(criterias.author == "Dante Alighieri" && criterias.id == 1){

				return {
					id : 1,
					author : "Dante Alighieri",
					title : "La divina commedia",
					summary : "inferno",
					text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
					tags: [1,3]
				};

			} else if (criterias.author == "Alessandro Manzoni" && criterias.id == 1){

				return {
					id: 1,
					author : "Alessandro Manzoni",
					title : "Promessi Sposi",
					summary : "..",
					text : "Quel ramo del lago di Como, che volge a mezzogiorno",
					tags: [1,2]
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
	  	//filterSpy.mockRestore();
	  	findOneSpy.mockRestore();
  	});

  	// Tests --------------------------------------------------------------------------

  	test('GET /article/:id/:author, success', async done =>{
		
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


  	test('GET /article/:id/:author, missing article', async done =>{
		
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


