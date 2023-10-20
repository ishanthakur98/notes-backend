const { default: mongoose } = require('mongoose');
const mnongoose  = require('mongoose');
require('dotenv').config() 

const uri = process.env.MONGO_DB_URL;

const connectToMongo = () => {
    console.log('connecting to mongo')
    mongoose.connect(uri)
    console.log('connected to mongo')
}

module.exports = connectToMongo;
