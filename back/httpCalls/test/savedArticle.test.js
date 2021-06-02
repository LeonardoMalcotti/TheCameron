const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe("saved articles tests", () =>{
    let spyFindUser, spyFindArticle, spyFindSavedArticle;

    beforeAll( () =>{
        const User = require("../../models/User");
        const Article = require("../../models/Article");
        const SavedArticles = require("../../models/SavedArticles");

        // Mock findOne User
        spyFindUser = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
            if(criterias.username == "dantealighieri"){
	            return [{
	                name: "Dante",
	                surname: "Alighieri",
                    username: "dantealighieri",
	                password: "12345678",
                    email: "dante.alighieri@loremipsum.it",
	            }];
	        }
            else if(criterias.username == "decamerone"){
	        	return [{
                    name: "Giovanni",
                    surname: "Boccaccio",
                    username: "decamerone",
                    password: "987654321",
                    email: "gio.boccaccio@loremipsum.it",
                }];
	        }
            else{
                return null;
            }
        });
        // Mock findOne Article
        spyFindArticle = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{
            if(criterias.id == "1" && criterias.author == "decamerone"){
                return [{
                    id: "1",
                    author: "decamerone",
                    title: "Lorem Ipsum",
                    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
                    date: "01012020",
                    tags: ["mock"],
                    restricted : false,
                }];
            }else if(criterias.id=="2" && criterias.author == "decamerone"){
                return [{
                    id: "2",
                    author: "decamerone",
                    title: "Lorem Ipsum2",
                    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
                    date: "01012020",
                    tags: ["mock", "mock2"],
                    restricted : false,
                }];
            }
            else
            {
                return null;
            }
        })
        // Mock findOne SavedArticle
        spyFindSavedArticle = jest.spyOn(SavedArticles, 'findOne').mockImplementation((criterias) =>{
            if(criterias.username == "dantealighieri"){
                return {
                    username: 'dantealighieri',
                    id: [1, 2],
                    author: ["decamerone", "decamerone"]
                };
            }else
            {
                return null;
            }
        });
    });

    afterAll( async () =>{
        spyFindSavedArticle.mockRestore();
        spyFindArticle.mockRestore();
        spyFindUser.mockRestore();
    });

    // Tests
    // GET saveArticle/:username , Valid data, returns array of 2 elements (203)
    test('GET savedArticle/:username , Valid data, returns array of 2 elements (201)', async done =>{
        const response = await request.get("/savedArticle/dantealighieri");
        expect(response.statusCode).toBe(201);
        expect(response.body.length).toBe(2); // Non so se funziona, da verificare se deve esserci qualcosa tra response e lenght
        done();
    });
    // GET saveArticle/:username , Valid data, user has no saved articles (404)
    test('GET savedArticle/:username , Valid data, user has no saved articles (404)', async done =>{
        const response = await request.get("/savedArticle/decamerone");
        expect(response.statusCode).toBe(404);
        done();
    });
    // GET saveArticle/:username , Invalid username
    test('GET savedArticle/:username , wrong username (404)', async done =>{
        const response = await request.get("/savedArticle/boccaccio");
        expect(response.statusCode).toBe(404);
        done();
    });
});
