const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);


describe('reaction test', () =>{

    let findArticleSpy;
    let findUserSpy;
    let findOneSpy;

    beforeAll( () => {
        const Article = require("../../models/Article");
        const Reaction = require("../../models/Reaction");
        const User = require("../../models/Usern");

        findArticleSpy = jest.spyOn(Article, 'find').mockImplementation((criterias) =>{
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
          }else{
	        	return null;
	        }
        });

        findUserSpy = jest.spyOn(User, 'find').mockImplementation((criterias) =>{
        	if(criterias.username == "dantealighieri"){
	            return {
                name: "Dante",
                surname: "Alighieri",
                email: "dante.alighieri@loremipsum.it",
                password: "12345678",
                username: "dantealighieri"
              };
          }else if(criterias.username == "giovannipascoli"){
            return {
              name: "Giovanni",
              surname: "Pascoli",
              email: "giovanni.pascoli@loremipsum.it",
              password: "12345678",
              username: "giovannipascoli"
            };
          }else if(criterias.username == "alessandromanzoni"){
            return {
              name: "Alessandro",
              surname: "Manzoni",
              email: "alessandro.manzoni@loremipsum.it",
              password: "12345678",
              username: "alessandromanzoni"
            };
          }else{
	        	return null;
	        }
        });

        findOneSpy = jest.spyOn(Reaction, 'findOne').mockImplementation(() =>{
          if(criterias.username == "dantealighieri" && criterias.id == 1 && criterias.author == "Dante Alighieri"){
            return {
                     id : 1,
                     author : "Dante Alighieri",
                     username : "dantealighieri",
                     reaction: 3
	           };
           }else {
            return null;
          }
           });
    });

    afterAll( async () =>{
        findArticleSpy.mockRestore();
        findUserSpy.mockRestore();
        findOneSpy.mockRestore();
    });

    //--------------------------------------------------------------------------
    test('POST /reaction missing data', async done =>{

        const response = await request
        .post('/article')
        .set('Accept', 'application/json')
        .send({author : "Alessandro Manzoni",});
        expect(response.statusCode).toBe(400);

        done();
    });

    test('POST /reaction missing User or Article', async done =>{

        const response = await request
        .post('/article')
        .set('Accept', 'application/json')
        .send({ id : 1,
              	author : "author",
              	username : "Username",
              	reaction: 3
              });
        expect(response.statusCode).toBe(404);

        done();
    });

    test('POST /reaction already exist', async done =>{

        const response = await request
        .post('/article')
        .set('Accept', 'application/json')
        .send({ id : 1,
              	author : "Dante Alighieri",
              	username : "dantealighieri",
              	reaction: 3
              });
        expect(response.statusCode).toBe(403);

        done();
    });

    test('POST /reaction valid data', async done =>{

        const response = await request
        .post('/article')
        .set('Accept', 'application/json')
        .send({ id : 1,
              	author : "Dante Alighieri",
              	username : "giovannipascoli",
              	reaction: 3
              });
        expect(response.statusCode).toBe(201);

        done();
    });


      test('GET /Reaction/:id/:author, success', async done =>{
        const response = await request.get('/Reaction/1/Dante Alighieri');
        let reaction = {
            id : 1,
            author : "Dante Alighieri",
          	username : "dantealighieri",
          	reaction: 3
        }
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(article.id);
        expect(response.body.author).toBe(article.author);
        expect(response.body.username).toBe(article.username);
        expect(response.body.reaction).toBe(article.reaction);
        done();


      });

      test('GET /reaction/:id/:author, missing article', async done =>{
        const response = await request.get('/reaction/3/Alessandro Manzoni');

        expect(response.statusCode).toBe(404);
        done();
      });

      test('GET /reaction/:id/:author, missing reaction', async done =>{
        const response = await request.get('/reaction/1/Alessandro Manzoni');

        expect(response.statusCode).toBe(404);
        done();
      });

      test('GET /Reaction/:username, success', async done =>{
        const response = await request.get('/Reaction/dantealighieri');
        let reaction = {
            id : 1,
            author : "Dante Alighieri",
          	username : "dantealighieri",
          	reaction: 3
        }
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(article.id);
        expect(response.body.author).toBe(article.author);
        expect(response.body.username).toBe(article.username);
        expect(response.body.reaction).toBe(article.reaction);
        done();


      });

      test('GET /reaction/:username, missing article', async done =>{
        const response = await request.get('/reaction/USername');

        expect(response.statusCode).toBe(404);
        done();
      });

      test('GET /reaction/:username, missing reaction', async done =>{
        const response = await request.get('/reaction/alessandromanzoni');

        expect(response.statusCode).toBe(404);
        done();
      });
    });


});
