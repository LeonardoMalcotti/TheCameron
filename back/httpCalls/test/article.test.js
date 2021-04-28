const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe('POST /article', () =>{

	//mock function per il metodo find in post /article
    let findSpy;

    beforeAll( () => {
        const Article = require("../../models/Article");

        findSpy = jest.spyOn(Article, 'find').mockImplementation((criterias) =>{
        	if(criterias.author == "Dante Alighieri"){
	            return [{
                	author : "Dante Alighieri",
                	title : "La divina commedia",
                	summary : "inferno",
                	text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
                	tag: "poema epico, italiano"
	            }];
	        } else {
	        	return [];
	        }
        });
    });

    afterAll( async () =>{
        findSpy.mockRestore();
    });

    //--------------------------------------------------------------------------

    test('POST /article missing data', async done =>{

        const response = await request.post('/article');
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
                    tag: "romanzo, italiano"
                  });

        expect(response.statusCode).toBe(201);

        done();
    });

  
});
