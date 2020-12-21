const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');





exports.order_get_all  = (req, res, next) =>{
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
    });  
}



exports.order_post = (req, res, next) => {
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
}

exports.order_get_id = (req, res, next) => {
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
}