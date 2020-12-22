const express = require('express');
const app =express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const Userscontroller = require('./api/controllers/userscontroller.js');




app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://trial1:"+ process.env.MONGO_ATLAS_PW + "@cluster0.cd0ef.mongodb.net/trial1?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
    );

mongoose.Promise = global.Promise;





app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/home', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/home page.html'));
})

app.get('/signup', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/signup.html'));
});


app.get('/users/registered', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/registered.html'));
})

app.get('/users/error_page1', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/error_page1.html'));
})

app.get('/users/error_page2', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/error_page2.html'));
})




app.post('/login', Userscontroller.user_login);
app.post('/signup', Userscontroller.user_signUp);





app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;