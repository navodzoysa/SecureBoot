var express = require('express');
var router = express.Router();
const { registerUser, loginUser, logoutUser, generateNewRefreshToken, getCurrentUser } = require('../controllers/userController');
const { authenticatedRoute } = require('../middleware/authHandler');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticatedRoute, logoutUser);
router.get('/current-user', authenticatedRoute, getCurrentUser);
router.post('/refresh-token', generateNewRefreshToken);

module.exports = router;
