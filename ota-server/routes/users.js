var express = require('express');
var router = express.Router();
const { registerUser, loginUser, getCurrentUser } = require('../controllers/userController');
const { authenticatedRoute } = require('../middleware/authHandler');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current-user', authenticatedRoute, getCurrentUser);

module.exports = router;
