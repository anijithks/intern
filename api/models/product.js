const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String, 
        required: true,
        minlength: 1,
        unique: true
    },
    price: { type: Number, 
        required: true,
        minlength: 1
    },
    productImage: {type:String, required: true}
    
});


module.exports = mongoose.model('Product', productSchema);