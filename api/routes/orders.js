const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');



//router.get('/', (req, res, next) => {
//    res.status(200).json({
//        message: 'Orders were fetched'
//    });
//});

router.get("/",checkAuth, (req, res, next) =>{
    Order.find().populate('product')
    .exec().then(docs => {
        res.status(200).json({
            count: docs.length ,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + doc._id
                }
            }
        })
            
        })
        
        //const response = {
        //    count: docs.length ,
        //    products: docs.map(doc => {
        //        return {
        //            name: doc.name,
        //            price: doc.price,
        //            quantity:doc.quantity,
        //            product:doc.productId,
        //            _id: doc._id,
        //            request: {
        //                type: "GET",
        //                url: "http://localhost:3000/orders/" + doc._id
        //            }
        //        }
        //    })
        //}
        //res.status(200).json(response);
    }); 
    
    
});
//router.post('/', (req, res, next) => {
//    res.status(201).json({
//        message: 'Orders were fetched'
//    });
//});


router.post('/',checkAuth, (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        if (!product){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order ({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "order stored",
            createdOrder: {
                _id: result._id,
                quantity: result.quantity,
                product: result.product
            },
            request: { 
                type:'GET',
                url: "http://localhost:3000/orders/" + result._id
             }
         })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
 });
//    .catch(err => {
//        res.status(500).json({
//            message: 'Product not found',
//            error: err
//       });
//    });
    
    //res.status(201).json({
    //    message: "Order was created",
    //    order: order
    //});
});



router.get('/:orderId',checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).select().exec().then(doc =>{
        console.log("From database",doc);
        if (doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: ' No entry found'});
        }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })
});


module.exports = router;