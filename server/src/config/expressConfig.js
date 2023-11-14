const express = require('express');
const cors = require('cors');
const path = require('path');
const { auth } = require('../middlewares/authMiddlewares');


exports.expressConfig = (app) =>{
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    app.use(cors());
    app.use('/api/src/profilePictures', express.static(path.join(__dirname, '../profilePictures')));
    app.use('/api/src/postImages', express.static(path.join(__dirname, '../postImages')));
    app.use(auth);
}