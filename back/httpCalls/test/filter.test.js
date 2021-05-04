const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe('GET /filters', () =>{

	//mock function per il metodo find in get /filters
    let findSpy;

    beforeAll( () => {
        const Article = require("../../models/Article");
        findSpy = jest.spyOn(Article, 'find').mockImplementation(() =>{
        	let pool =[
	        	{
	        		id: "1", 
	        		author: "tizio", 
	        		title: "Breve guida su come testare con jest", 
	        		summary: "summ",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    date: "1",
                    tags: []
	        	},
	        	{
	        		id: "2", 
	        		author: "caio", 
	        		title: "Come utilizzare jEsT e spyOn al meglio", 
	        		summary: "summ",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    date: "2",
                    tags: ["hello"]
        		},
        		{
	        		id: "3", 
	        		author: "tizio", 
	        		title: "Altro titolo con jestAll'interno", 
	        		summary: "summ",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    date: "3",
                    tags: ["world"]
	        	},
	        	{
	        		id: "4", 
	        		author: "caio", 
	        		title: "Altro titolo", 
	        		summary: "summ",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    date: "4",
                    tags: ["hello", "world"]                    
	        	},
	        	{
	        		id: "5", 
	        		author: "tizio", 
	        		title: "Qualcos'altro a caso", 
	        		summary: "summ",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    date: "5",
                    tags: ["thecameron"]
	        	},
        	];
        	return pool;
        });
    });
    afterAll( async () =>{
        findSpy.mockRestore();
    });

    //--------------------------------------------------------------------------

    test('GET /search author=tizio ok', async done =>{
        const response = await request
            .get('/search?author=tizio')
            .set('Accept', 'application/json')
            .send();
        expect(response.statusCode).toBe(201);
        expect(response.body.length).toBe(3);
        done();
    });

    test('GET /search tags=[hello, world] success', async done =>{
        const response = await request
            .get('/search?tags[]=hello&tags[]=world')
            .set('Accept', 'application/json')
            .send();

        expect(response.statusCode).toBe(201);
        expect(response.body.length).toBe(3);
        done();
    });

    test('GET /search author=caio tags=[world] success', async done =>{
        const response = await request
            .get('/search?author=caio&tags[]=world')
            .set('Accept', 'application/json')
            .send();

        expect(response.statusCode).toBe(201);
        expect(response.body.length).toBe(1);
        done();
    });

    test('GET /search author=supermario success no results', async done =>{
        const response = await request
            .get('/search?author=supermario')
            .set('Accept', 'application/json')
            .send();

        expect(response.statusCode).toBe(201);
        expect(response.body.length).toBe(0);
        done();
    });


});