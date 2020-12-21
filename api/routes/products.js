const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Productscontroller = require('../controllers/productscontroller.js');
const multer = require('multer');


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

router.get("/", Productscontroller.product_get_all)
router.post('/', checkAuth, upload.single('productImage'), Productscontroller.product_post);
router.get('/:productId',  Productscontroller.product_get_id );
router.delete('/:productId', checkAuth, Productscontroller.product_delete );
router.patch("/:productId",checkAuth, Productscontroller.product_patch);
module.exports = router;