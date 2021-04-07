const supertest = require('supertest');
const app = require('../.././app');
const request = supertest(app);

describe('POST /article', () =>{

	//mock function per il metodo find in post /article
    let findSpy;

    beforeAll( () => {
        const Article = require("../../models/Article");
        /*
		Mock Implementation per il metodo find in post /article
		Finge che nel db esista solo un articolo con author "Dante Alighieri" e id 0
		criterias contiene i parametri della chiamata
		restituisce i dati dell'utente solo se criterias.author è "Dante Alighieri" e criterias.id è 0
		in qualsiasi altro caso si comporta come se non avesse trovato nulla
        */
        findSpy = jest.spyOn(Article, 'find').mockImplementation((criterias) =>{
        	if(criterias.author == "Dante Alighieri" && criterias.id == 0){
	            return [{
                  id : 0,
                	author : "Dante Alighieri",
                	title : "La divina commedia",
                	summary : "inferno",
                	text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura,ché la diritta via era smarrita.Ahi quanto a dir qual era è cosa dura
                          esta selva selvaggia e aspra e forte che nel pensier rinova la paura",
                	date : 01/01/1321,
                	tag: ["poema epico"],["italiano"]
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

    test('POST /article missing data', async done =>{
        expect.assertions(1);
        const response = await request.post('/article');

        expect(response.statusCode).toBe(400);

        done();
    });

    test('POST /article valid data', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/article')
            .set('Accept', 'application/json')
            .send({ id : 1,
                    author : "Alessandro Manzoni",
                    title : "Promessi Sposi",
                    summary : "..",
                    text : "Quel ramo del lago di Como, che volge a mezzogiorno, tra due catene non interrotte di monti, tutto a seni e a golfi, a seconda dello sporgere e del rientrare di quelli, vien quasi a un tratto, tra un promontorio a destra e un'ampia costiera dall'altra parte",
                    date : 01/01/1827,
                    tag: ["romanzo"],["italiano"]});

        expect(response.statusCode).toBe(201);

        done();
    });

    test('POST /article invalid data, already existing article', async done =>{
        expect.assertions(1);
        const response = await request
            .post('/article')
            .set('Accept', 'application/json')
            .send({ id : 0,
                    author : "Dante Alighieri",
                    title : "La divina commedia",
                    summary : "inferno",
                    text : "Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura,ché la diritta via era smarrita.Ahi quanto a dir qual era è cosa dura
                            esta selva selvaggia e aspra e forte che nel pensier rinova la paura",
                    date : 01/01/1321,
                    tag: ["poema epico"],["italiano"]});

        expect(response.statusCode).toBe(403);

        done();
    });
});
