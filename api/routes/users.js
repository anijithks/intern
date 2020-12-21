const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const Userscontroller = require('../controllers/userscontroller.js');

router.get('/', Userscontroller.user_get_all);
router.post('/login',Userscontroller.user_login);
router.post('/signup', Userscontroller.user_signUp);
router.delete('/:userId',checkAuth, Userscontroller.user_delete);
module.exports = router;