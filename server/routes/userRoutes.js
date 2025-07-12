const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:id', userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.post('/rate', auth, userController.rateUser);
router.get('/all', auth, userController.getAllUsers); // PROTECTED
router.get('/:userId', auth, userController.getUserById);

module.exports = router;
