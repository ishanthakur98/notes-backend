const express = require('express');
const app = express();
const connectToMongo = require('./db');
require('dotenv').config();


connectToMongo();

app.use(express.json());

app.use('/api/auth' , require('./controller/auth'));

app.use('/api/notes' , require('./controller/notes'))

app.get("/" , (req,res) => {
    return res.send("hello world");
});


app.listen(process.env.PORT);