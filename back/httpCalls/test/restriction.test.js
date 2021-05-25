const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe("article restriction test", () =>{
    //mock function per findOne di User, Article e Subscription
    let spyFindUser, spyFindSub, spyFindArticle;

    beforeAll( () =>{
        const User = require("../../models/User");
        const Subscription = require("../../models/Subscription");
        const Article = require("../../models/Article");
        
        spyFindUser = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
            if(criterias.username == "dantealighieri"){
	            return [{
	                name: "Dante",  
	                surname: "Alighieri", 
	                email: "dante.alighieri@loremipsum.it", 
	                password: "12345678", 
	                username: "dantealighieri"
	            }];
	        } else if(criterias.username == "boccaccio"){
	        	return [{
                    name: "Giovanni",
                    surname: "Boccaccio",
                    email: "gio.boccaccio@loremipsum.it",
                    password: "987654321",
                    username: "boccaccio"
                }];
	        } else{
                return null;
            }
        })

        spyFindArticle = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{ 
            if(criterias.id == "1" && criterias.author == "decamerone"){
                return [{
                    id: "1",  
                    author: "decamerone", 
                    title: "Lorem Ipsum", 
                    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
                    text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
                    date: "01012020",
                    tags: "mock",
                    restricted : true
                }];
            }else if(criterias.id=="2" && criterias.author == "decamerone"){
                return [{
                    id: "2",  
                    author: "decamerone", 
                    title: "Lorem Ipsum2", 
                    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
                    text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
                    date: "01012020",
                    tags: "mock",
                    restricted : false
                }];
            }
            else
            {
                return null;
            }
        })

        spyFindSub = jest.spyOn(Subscription, 'findOne').mockImplementation((criterias) =>{
            if(criterias.username == "dantealighieri"){
	            return [{
	                username: "dantealighieri",
                    dateSubscription: "10102020"
	            }];
	        } else {
	        	return null;
	        }
        })
    })

    afterAll( async () =>{
        spyFindArticle.mockRestore();
        spyFindSub.mockRestore();
        spyFindUser.mockRestore();
    });

    // Tests
    test('GET /restricted/article/:id/:author/user/:username , access granted', async done =>{
        const response = await request.get("/restricted/article/1/decamerone/user/dantealighieri");
        expect(response.statusCode).toBe(204);
        done();
    });
    
    test('GET /restricted/article/:id/:author/user/:username, access denied', async done =>{
        const response = await request.get("/restricted/article/1/decamerone/user/boccaccio");
        expect(response.statusCode).toBe(403);
        done();
    });

    test('GET /restricted/article/:id/:author/user/:username, non existing article', async done =>{
        const response = await request.get("/restricted/article/2/boccaccio/user/dantealighieri");
        expect(response.statusCode).toBe(404);
        expect(response.error).toBe("Autore o id non presente");
        done();
    });

    test('GET /restricted/article/:id/:author/user/:username , non restricted article access granted', async done =>{
        const response = await request.get("/restricted/article/2/decamerone/user/dantealighieri");
        expect(response.statusCode).toBe(204);
        done();
    });
    
    test('GET /restricted/article/:id/:author/user/:username, non existing user', async done =>{
        const response = await request.get("/restricted/article/1/decamerone/user/manzoni");
        expect(response.statusCode).toBe(404);
        expect(response.error).toBe("User non esiste");
        done();
    });
})