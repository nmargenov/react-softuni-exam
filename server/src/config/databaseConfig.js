const mongoose = require('mongoose');
const { URI } = require('./config');

exports.connectToDB = () =>{
    return mongoose.connect(URI);
}