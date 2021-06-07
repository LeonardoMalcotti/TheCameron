const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);


describe('Favorite tags',()=> {

	let TagSpy;
	let FavoriteSpy;
	let UserSpy;
	let TagSpyOne;

	let tags = [
	{
		id : 1,
		name : "Science"
	},
	{
		id : 2,
		name : "Politics"
	},
	{
		id : 3,
		name : "Humor"
	}];

	let user = {
		name: "Dante",
		surname: "Alighieri",
		email: "dante.alighieri@loremipsum.it",
		password: "12345678",
		username: "dantealighieri"
	};

	beforeAll( () => {

		const Tag = require("../../models/Tag");
		const Favorite = require("../../models/FavoriteTags");
		const User = require("../../models/User");

    	Userspy = jest.spyOn(User,'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
		        return user
      		}

      		return null;
		});


		Tagspy = jest.spyOn(Tag,'find').mockImplementation((criterias) =>{
			return tags;
		});


		TagSpyOne = jest.spyOn(Tag,'findOne').mockImplementation((criterias) =>{

			if(criterias.id == "1"){
				return tags[0];
			}

			if(criterias.name == "Science"){
				return tags[0];
			}

			return null;
		});

		FavoriteSpy = jest.spyOn(Favorite,'findOne').mockImplementation((criterias) =>{
			
    		if(criterias.username == "dantealighieri"){
    			return {
    				username : "dantealighieri",
    				id : [1,2]
    			};
    		}

			return null;
		});

	});

	afterAll( async () =>{
	   	UserSpy.mockRestore();
     	Tagspy.mockRestore();
     	FavoriteSpy.mockRestore();
		TagSpyOne.mockRestore();
   	});

//Test---------------------------------------------------------------


	test("GET tag/user/:username", async done =>{
    	
    	const response = await request.get("/tag/user/dantealighieri").set('Accept', 'application/json');

		expect(response.body.length).toBe(2);
    	expect(response.statusCode).toBe(200);
    	done();
    });


	test("GET tag/user/:username, miss user", async done =>{
    	
    	const response = await request.get("/tag/user/username").set('Accept', 'application/json');

    	expect(response.statusCode).toBe(404);
    	done();
    });
});