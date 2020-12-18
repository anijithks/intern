const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');



const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
//reject a file
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true);
    } else{
        cb(null, false);
    }
    
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

//const upload = multer({dest:'uploads/'});

const Product = require('../models/product');


//router.get('/', (req, res, next)=> {
//    res.status(200).json({
//        message: 'Handling GET request to /products'
//    })
//})


router.get("/", (req, res, next) =>{
    Product.find().select("name price _id productImage").exec().then(docs => {
        const response = {
            count: docs.length ,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage:doc.productImage,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    }); 
    
    
})


//router.get('/', (req, res, next)=> {
//    res.status(200).json({
//        message: 'Handling GET request to /products'
//    })
//})

router.post('/',checkAuth,upload.single('productImage'), (req, res, next) => {
    //console.log(req.file);
   // const product = {
    //    name: req.body.name,
    //    price: req.body.price
    //};
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        })
        .catch(err => console.log(err));
        res.status(201).json({
            message: 'Handling POST request to /products',
            createdProduct: product
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('_id name price productImage').exec().then(doc =>{
        console.log("From database",doc);
        if (doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products'
                }
            });
        } else {
            res.status(404).json({message: ' No entry found'});
        }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })
    //if (id === 'special') {
    //    res.status(200).json({
    //        message: 'ýou discovered th id',
    //        id:ids
    //    })

    //} else {
    //    res.status(200).json({
     //       message: 'you passed'
     //   })
    //}
});

router.delete('/:productId',checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec().then(result=>{
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body:{ name:'String', price: 'Number'}
            }
        });
    })
})


router.patch("/:productId",checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps}).exec().then(result=>{
       // console.log(result);
       // res.status(200).json(result);
       res.status(200).json({
           message: 'Product updated',
           request: {
               type: 'GET',
               url: 'http://localhost:3000/products/' + id
           }
       });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});



module.exports = router;