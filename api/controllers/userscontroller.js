const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.user_get_all = (req, res, next) =>{
    User.find().exec().then(docs => {
        const response = {
        count: docs.length ,
        users: docs.map(doc => {
            return {
                email: doc.email,
                password: doc.password,
                productImage:doc.productImage,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/users/" + doc._id
                }
            }
        })
    }
    res.status(200).json(response);
}); 
}

exports.user_login = (req, res, next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                }
                );
                return res.redirect('/home')
            }
            res.status(401).json({
                message: 'Auth failed'
            })
        })
    })
}



exports.user_signUp = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return  res.redirect('/users/error_page1')
            res.status(409).json({
                message: 'Mail already exists'
            });
        } else { 
                password= req.body.password
                confirmpassword= req.body.confirmpassword
            if(password !== confirmpassword) {
                return res.redirect('/users/error_page2')
                res.status(409).json({
                    message: ' password is not match '})
            } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        confirmpassword:hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        return res.redirect('/users/registered');
                       // res.status(201).json({
                        //    message: 'User created',
                         //   url: "http://localhost:3000/users/login"     
                        //});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            });
        }}  
    });
}


exports.user_delete = (req,res, next) => {
    User.find({_id: req.params.userId})
    .exec()
    .then(user => {
        if (!user ) {
            return res.status(409).json({
                message: 'id not found ' 
            });
        } else {User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
            message: "User deleted"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            erro:err
        })
    })
}
})
}