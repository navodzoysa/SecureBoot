const moongoose = require('mongoose');
const mongodbString = process.env.DATABASE_URL;

moongoose.connect(mongodbString);
const database = moongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database;
