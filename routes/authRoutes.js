const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

router.get('/login', authController.showLoginForm);
router.post('/register', authController.register);
router.get('/register', authController.showRegisterForm);
router.post('/add-admin', authController.addAdmin);

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/getUsers', authController.getUsers);
// router.get('/welcome', authController.welcome);
router.get('/welcome', authenticate, authController.welcome);



router.get('/dashboard', authController.dashboard);
router.get('/header', authController.showHeadersPage); 

module.exports = router;
