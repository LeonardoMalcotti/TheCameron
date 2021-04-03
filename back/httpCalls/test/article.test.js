const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe('search article by title', () =>{

	let Spy;

    beforeAll( () => {
        const User = require("../../models/Article");
        Spy = jest.spyOn(User, 'find').mockImplementation((criterias) =>{
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
    });

    afterAll( async () =>{
        findSpy.mockRestore();
    });

    //--------------------------------------------------------------------------

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



});