const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);


describe('Filters', () =>{

	let ArticleFindSpy;

	beforeAll( () => {
		
		const Article = require("../../models/Article");
		
		let pool =[
		{
			id: 1, 
			author: "tizio", 
			title: "Breve guida su come testare con jest", 
			summary: "summ",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			date: "1",
			tags: []
		},
		{
			id: 2, 
			author: "caio", 
			title: "Come utilizzare jEsT e spyOn al meglio", 
			summary: "summ",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			date: "2",
			tags: [1]
		},
		{
			id: 3, 
			author: "tizio", 
			title: "Altro titolo con jestAll'interno", 
			summary: "summ",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			date: "3",
			tags: [2]
		},
		{
			id: 4, 
			author: "tizio", 
			title: "Altro titolo", 
			summary: "summ",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			date: "4",
			tags: [1,2]                    
		},
		{
			id: 5, 
			author: "caio", 
			title: "Qualcos'altro a caso", 
			summary: "summ",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			date: "5",
			tags: [1,2,3]
		},
		];

		ArticleFindSpy = jest.spyOn(Article, 'find').mockImplementation(() =>{
			return pool;
		});

	});

	afterAll( async () =>{
		ArticleFindSpy.mockRestore();
	});

	//--------------------------------------------------------------------------
	test('GET /article/filters no params', async done =>{
		
		const response = await request
			.get('/article/filters')
			.set('Accept', 'application/json')
			.send();

		expect(response.statusCode).toBe(201);
		expect(response.body.length).toBe(5);
		done();
	});

	test('GET /article/filters author=tizio ok', async done =>{
		
		const response = await request
			.get('/article/filters?author=tizio')
			.set('Accept', 'application/json')
			.send();

		expect(response.statusCode).toBe(201);
		expect(response.body.length).toBe(3);
		done();
	});

	test('GET /article/filters tags=[1, 2] success', async done =>{
		
		const response = await request
			.get('/article/filters?tags[]=1&tags[]=2')
			.set('Accept', 'application/json')
			.send();

		expect(response.statusCode).toBe(201);
		expect(response.body.length).toBe(2);
		done();
	});

	test('GET /article/filters author=caio tags=[2] success', async done =>{
		
		const response = await request
			.get('/article/filters?author=caio&tags[]=2')
			.set('Accept', 'application/json')
			.send();

		expect(response.statusCode).toBe(201);
		expect(response.body.length).toBe(1);
		done();
	});

	test('GET /article/filters author=supermario success no results', async done =>{
		
		const response = await request
			.get('/article/filters?author=supermario')
			.set('Accept', 'application/json')
			.send();

		expect(response.statusCode).toBe(201);
		expect(response.body.length).toBe(0);
		done();
	});


});