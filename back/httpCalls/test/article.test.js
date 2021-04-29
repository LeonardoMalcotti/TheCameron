const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe('POST /article', () =>{

	//mock function per il metodo find in post /article
    let findSpy;
    let filterSpy;

    beforeAll( () => {
        const Article = require("../../models/Article");

        findSpy = jest.spyOn(Article, 'find').mockImplementation(() =>{

	            return [{
                 id : 1,
                 author : "Dante Alighieri",
                 title : "La divina commedia",
                 summary : "inferno",
                 text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
                 tag: "poema epico, italiano"
             },{
                id: 1,
                author : "Alessandro Manzoni",
                title : "Promessi Sposi",
                summary : "..",
                text : "Quel ramo del lago di Como, che volge a mezzogiorno",
                tag: "romanzo, italiano"
            }];
          });

        filterSpy = jest.fn(Article, 'filter').mockImplementation((criterias) =>{
          if(criterias.author == "Alessandro Manzoni"){
            return [{
              id: 1,
              author : "Alessandro Manzoni",
              title : "Promessi Sposi",
              summary : "..",
              text : "Quel ramo del lago di Como, che volge a mezzogiorno",
              tag: "romanzo, italiano"
            }];
          }
        });
    });

    afterAll( async () =>{
        findSpy.mockRestore();
    });

    //--------------------------------------------------------------------------

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
                    tag: "romanzo, italiano"
                  });

        expect(response.statusCode).toBe(201);

        done();
    });
});
