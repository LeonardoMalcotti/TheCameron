const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);

describe('tag test',()=> {

	let TagSpy;
	let FavoriteSpy;
	let UserSpy;
	let favoriteDelSpy;
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
      return {};
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

    FavoriteSpy = jest.spyOn(Favorite,'findOne').mockImplementation((criterias) =>{
			let ret = {
				username : "dantealighieri",
				id : [1,2,3]
			};
			if(criterias.username == "dantealighieri"){
				return ret;
			}
			return {};
		});
	});

	afterAll( async () =>{
	   UserSpy.mockRestore();
     Tagspy.mockRestore();
     FavoriteSpy.mockRestore();
   });

//-------------------------------------------------------------------
//tests


	test("POST tag/user/:username, success", async done =>{
		const response = await request.post("/tag/user/dantealighieri")
    .set('Accept', 'application/json')
    .send({id:3});
		expect(response.statusCode).toBe(201);
	});

  test("POST tag/user/:username, missing user", async done =>{
		const response = await request.post("/tag/user/username")
    .set('Accept', 'application/json')
    .send({id:3});
		expect(response.statusCode).toBe(404);
	});

	test("GET tag/user/:username", async done =>{
    const response = await request.get("/tag/user/dantealighieri")
    .set('Accept', 'application/json');

    expect(response.statusCode).toBe(201);
  });

	test("DELETE tag/user/:username/favorite/:id", async done =>{
    const response = await request.delete("/tag/user/dantealighieri/favorite/1")
    .set('Accept', 'application/json');
    expect(response.statusCode).toBe(204);
  });


});
