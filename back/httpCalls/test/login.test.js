const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe('POST /login', () =>{

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

    test('POST /login missing all data', async done =>{
        expect.assertions(1);
        const response = await request.post('/login');

        expect(response.statusCode).toBe(400);
        done();
    });

    test('POST /login missing password', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/login')
            .set('Accept', 'application/json')
            .send({username: "dantealighieri",
                   email: "dante.alighieri@loremipsum.it" 
            });
            
        expect(response.statusCode).toBe(400);
        done();
    });

    test('POST /login wrong password', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/login')
            .set('Accept', 'application/json')
            .send({email: "dante.alighieri@loremipsum.it", 
                   password: "87654321" 
            });
            
        expect(response.statusCode).toBe(400);
        done();
    });

    test('POST /login valid data', async done =>{
        expect.assertions(3);
        const response = await request
            .post('/login')
            .set('Accept', 'application/json')
            .send({username: "dantealighieri",
                   email: "dante.alighieri@loremipsum.it", 
                   password: "12345678" 
            });
            
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
        done();
    });
    
    test('POST /login wrong password', async done =>{
        expect.assertions(2);
        const response = await request
            .post('/login')
            .set('Accept', 'application/json')
            .send({username: "dantealighieri",
                   email: "dante.alighieri@loremipsum.it", 
                   password: "87654321" 
            });
            
        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
        done();
    });

    test('POST /login wrong username', async done =>{
        expect.assertions(2);
        const response = await request
            .post('/login')
            .set('Accept', 'application/json')
            .send({username: "giovanniboccaccio",
                   email: "certaldese@loremipsum.it", 
                   password: "123456789" 
            });
            
        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
        done();
    });
    

});
