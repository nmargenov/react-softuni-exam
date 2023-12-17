const mongoose = require('mongoose');

const URI = process.env.URI;

exports.connectToDB = () =>{
    return mongoose.connect(URI);
}