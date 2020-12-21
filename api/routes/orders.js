const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Orderscontroller = require('../controllers/orderscontroller.js')


router.get('/', checkAuth, Orderscontroller.order_get_all );
router.post('/',checkAuth,Orderscontroller.order_post);
router.get('/:orderId', checkAuth, Orderscontroller.order_get_id );
module.exports = router;