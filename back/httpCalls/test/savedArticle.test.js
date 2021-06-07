const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);


describe("Saved articles", () =>{

	let spyFindUser;
	let spyFindArticle;
	let spyFindSavedArticle;

	beforeAll( () =>{
		const User = require("../../models/User");
		const Article = require("../../models/Article");
		const SavedArticles = require("../../models/SavedArticles");

		spyFindUser = jest.spyOn(User, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
				
				return {
					name: "Dante",
					surname: "Alighieri",
					username: "dantealighieri",
					password: "12345678",
					email: "dante.alighieri@loremipsum.it",
				};

			} 

			if (criterias.username == "decamerone"){
				
				return {
					name: "Giovanni",
					surname: "Boccaccio",
					username: "decamerone",
					password: "987654321",
					email: "gio.boccaccio@loremipsum.it",
				};

			}
			
			return null;
		});
		
		spyFindArticle = jest.spyOn(Article, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.id == "1" && criterias.author == "decamerone"){
				
				return {
					id: "1",
					author: "decamerone",
					title: "Lorem Ipsum",
					summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
					date: "01012020",
					tags: [1],
					restricted : false,
				};

			} 

			if (criterias.id=="2" && criterias.author == "decamerone"){
				
				return {
					id: "2",
					author: "decamerone",
					title: "Lorem Ipsum2",
					summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
					date: "01012020",
					tags: [1,2],
					restricted : false,
				};

			}

			if (criterias.id == 3 && criterias.author == "decamerone"){
				
				return {
					id: 3,
					author: "decamerone",
					title: "Lorem Ipsum3",
					summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
					text: "lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.",
					date: "01012020",
					tags: [3],
					restricted : false,
				};

			}
			
			return null;
		});
		
		spyFindSavedArticle = jest.spyOn(SavedArticles, 'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
				
				return {
					username: 'dantealighieri',
					articles: [
					{
						id : 1,
						author : "decamerone"
					},
					{
						id : 2,
						author : "decamerone"
					}
					]
				};

			}
			
			return null;
		});
	});

	afterAll( async () =>{
		spyFindSavedArticle.mockRestore();
		spyFindArticle.mockRestore();
		spyFindUser.mockRestore();
	});

	// Tests ---------------------------------------------------------------


	test('POST savedArticle/:username, article alreasy saved', async done =>{

		const response = await request.post("/savedArticle/dantealighieri")
			.send({
				id : 1,
				author : "decamerone"
			});
		
		expect(response.statusCode).toBe(403);
		done();
	});


	test('GET savedArticle/:username , Valid data', async done =>{
		
		const response = await request.get("/savedArticle/dantealighieri");
		
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(2);
		done();
	});


	test('GET savedArticle/:username , Valid data, no saved articles', async done =>{
		
		const response = await request.get("/savedArticle/decamerone");
		
		expect(response.statusCode).toBe(404);
		done();
	});


	test('GET savedArticle/:username , wrong username', async done =>{
		
		const response = await request.get("/savedArticle/boccaccio");
		
		expect(response.statusCode).toBe(404);
		done();
	});
});
