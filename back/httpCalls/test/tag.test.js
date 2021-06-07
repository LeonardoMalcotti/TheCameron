const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);


describe('Tag',()=> {

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

//-------------------------------------------------------------------
//tests


	test("POST tag/:name, already exist", async done =>{
		const response = await request.post("/tag/Science").set('Accept', 'application/json');

		expect(response.statusCode).toBe(404);
		done();
	});


	test("POST tag/:name, success", async done =>{
		const response = await request.post("/tag/Romantic").set('Accept', 'application/json');

		expect(response.statusCode).toBe(201);
		done();
	});


	test("GET tag/:name, success", async done =>{
    	const response = await request.get("/tag/Science").set('Accept', 'application/json');

		expect(response.body.id).toBe(1);
    	expect(response.statusCode).toBe(200);
    	done();
    });


	test("GET tag/:name, miss tag", async done =>{
    	const response = await request.get("/tag/test").set('Accept', 'application/json');

    	expect(response.statusCode).toBe(404);
    	done();
    });


	test("GET tag/id/:id, success", async done =>{
    	const response = await request.get("/tag/id/1").set('Accept', 'application/json');

		expect(response.body.name).toBe("Science");
    	expect(response.statusCode).toBe(200);
    	done();
    });


	test("GET tag/id/:id, miss tag", async done =>{
    	const response = await request.get("/tag/id/100").set('Accept', 'application/json');

    	expect(response.statusCode).toBe(404);
    	done();
  	});

});
