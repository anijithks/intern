const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Userscontroller = require('../controllers/userscontroller.js');

router.get('/', checkAuth, Userscontroller.user_get_all);
router.delete('/:userId', checkAuth, Userscontroller.user_delete);
module.exports = router;