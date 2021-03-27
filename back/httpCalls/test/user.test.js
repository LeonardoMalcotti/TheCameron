const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe('POST /user', () =>{

	//mock function per il metodo find in post /user
    let findSpy;

    beforeAll( () => {
        const User = require("../../models/User");
        /*
		Mock Implementation per il metodo find in post /user
		Finge che nel db esista solo un utente con username "dantealighieri"

		criterias contiene i parametri della chiamata
		restituisce i dati dell'utente solo se criterias.username è "dantealighieri"
		in qualsiasi altro caso si comporta come se non avesse trovato nulla
        */
        findSpy = jest.spyOn(User, 'find').mockImplementation((criterias) =>{
        	if(criterias.username == "dantealighieri"){
	            return [{
	                name: "Dante",  
	                surname: "Alighieri", 
	                email: "dante.alighieri@loremipsum.it", 
	                password: "12345678", 
	                username: "dantealighieri"
	            }];
	        } else {
	        	return [];
	        }
        });
    });

    afterAll( async () =>{
        findSpy.mockRestore();
    });

    //--------------------------------------------------------------------------

    test('POST /user missing data', async done =>{
        expect.assertions(1);
        const response = await request.post('/user');

        expect(response.statusCode).toBe(400);

        done();
    });

    test('POST /user valid data', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/user')
            .set('Accept', 'application/json')
            .send({name: "Filippo",  
                   surname: "Fanton", 
                   email: "filippo.fanton@studenti.unitn.it", 
                   password: "12345678", 
                   username: "filippofanton"});

        expect(response.statusCode).toBe(201);

        done();
    });

    test('POST /user invalid data, already existing user', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/user')
            .set('Accept', 'application/json')
            .send({name: "Dante",  
                   surname: "Alighieri", 
                   email: "dante.alighieri@loremipsum.it", 
                   password: "12345678", 
                   username: "dantealighieri"});
            
        expect(response.statusCode).toBe(403);

        done();
    });
});
