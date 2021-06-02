const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);


describe('tag test',()=> {

	let TagSpy;
	let FavoriteSpy;
	let UserSpy;
	let TagSpyOne;

	beforeAll( () => {
		const Tag = require("../../models/Tag");
		const Favorite = require("../../models/FavoriteTags");
		const User = require("../../models/User");

    	Userspy = jest.spyOn(User,'findOne').mockImplementation((criterias) =>{
			
			if(criterias.username == "dantealighieri"){
		        
		        return {
		  				name: "Dante",
		          		surname: "Alighieri",
		          		email: "dante.alighieri@loremipsum.it",
		          		password: "12345678",
		          		username: "dantealighieri"
		  		};

      		}

      		return null;
		});

		Tagspy = jest.spyOn(Tag,'find').mockImplementation((criterias) =>{
			let ret = [
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

			return ret;
		});

		TagSpyOne = jest.spyOn(Tag,'findOne').mockImplementation((criterias) =>{
			
			let ret = {
				id : 1,
				name : "Science"
			};

			if(criterias.id == "1"){
				return ret;
			}

			if(criterias.name == "Science"){
				return ret;
			}

			return null;
		});

    	FavoriteSpy = jest.spyOn(Favorite,'findOne').mockImplementation((criterias) =>{
			
			let ret = {
				username : "dantealighieri",
				id : [1,2]
			};

			if(criterias.username == "dantealighieri"){
				return ret;
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


/*	test("POST tag/user/:username, success", async done =>{
		const response = await request.post("/tag/user/dantealighieri")
    .set('Accept', 'application/json')
    .send({id:3});
		expect(response.statusCode).toBe(201);
	});*/

  /*test("POST tag/user/:username, miss user", async done =>{
		const response = await request.post("/tag/user/username")
    .set('Accept', 'application/json')
    .send({id:3});
		expect(response.statusCode).toBe(404);
	});*/

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


	test("GET tag/user/:username", async done =>{
    	const response = await request.get("/tag/user/dantealighieri").set('Accept', 'application/json');

		expect(response.body.length).toBe(2);
    	expect(response.statusCode).toBe(201);
    	done();
    });


	test("GET tag/user/:username, miss user", async done =>{
    	const response = await request.get("/tag/user/username").set('Accept', 'application/json');

    	expect(response.statusCode).toBe(404);
    	done();
    });


	test("GET tag/:name, success", async done =>{
    	const response = await request.get("/tag/Science").set('Accept', 'application/json');

		expect(response.body.id).toBe(1);
    	expect(response.statusCode).toBe(201);
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
    	expect(response.statusCode).toBe(201);
    	done();
    });


	test("GET tag/id/:id, miss tag", async done =>{
    	const response = await request.get("/tag/id/100").set('Accept', 'application/json');

    	expect(response.statusCode).toBe(404);
    	done();
  	});

});
