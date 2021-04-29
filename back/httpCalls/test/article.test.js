const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);


describe('article test', () =>{

    let findOneSpy;
    let findSpy;
    let filterSpy;

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
                tag: "poema epico, italiano"
              };
          }else if(criterias.author == "Alessandro Manzoni" && criterias.id == 1){
            return {
                id: 1,
                author : "Alessandro Manzoni",
                title : "Promessi Sposi",
                summary : "..",
                text : "Quel ramo del lago di Como, che volge a mezzogiorno",
                tag: "romanzo, italiano"
            };
          }else {
	        	return null;
	        }
        });

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
        filterSpy.mockRestore();
        findOneSpy.mockRestore();
    });

    //--------------------------------------------------------------------------

      test('GET /Article/:id/:author, success', async done =>{
        const response = await request.get('/article/1/Dante Alighieri');
        let article = {
            id : 1,
           author : "Dante Alighieri",
           title : "La divina commedia",
           summary : "inferno",
           text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura",
           tag: "poema epico, italiano"
        }
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(article.id);
        expect(response.body.author).toBe(article.author);
        expect(response.body.title).toBe(article.title);
        expect(response.body.summary).toBe(article.summary);
        expect(response.body.text).toBe(article.text);
        expect(response.body.tag).toBe(article.tag);
        done();


      });

      test('GET /Article/:id/:author, missing article', async done =>{
        const response = await request.get('/user/3/Alessandro Manzoni');

        expect(response.statusCode).toBe(404);
        done();
      });

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
                    tag: "romanzo, italiano"
                  });

        expect(response.statusCode).toBe(201);

        done();
    });
});

