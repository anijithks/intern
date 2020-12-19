const express = require('express');
const app =express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const {validationResult} = require('express-validator');
//const { validateConfirmPassword } = require('./api/middleware/validation-rule') ;

const path = require('path');

//require('dotenv').config();

//const MongoClient = require('mongodb').MongoClient;
//const uri = "mongodb+srv://<username>:<password>@node-shop.00fuy.mongodb.net/<dbname>?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true });
//client.connect(err => {
  //const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  //client.close();
//});










const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://trial1:"+ process.env.MONGO_ATLAS_PW + "@cluster0.cd0ef.mongodb.net/trial1?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
    );

mongoose.Promise = global.Promise;





app.get('/users/login', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/login.html'));
});


app.get('/users/signup', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/signup.html'));
});


app.get('/users/registered', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/registered.html'));
})


app.get('/home', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/home page.html'));
})





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
//app.use((req, res, next) => {
 //   res.status(200).json({
  //      message: 'It works!',
   // })
//})
//app.use((req, res, next) => {
//    const error = new Error('Not found');
 //   error.status=404;
//    next(error);
//})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;