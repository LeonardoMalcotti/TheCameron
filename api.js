const app = require('./back/app.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

app.locals.db = mongoose.connect(process.env.DB_URL,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
	app.listen(port, function(){
	    console.log(`Server listening on port ${port}`);
	});
});
