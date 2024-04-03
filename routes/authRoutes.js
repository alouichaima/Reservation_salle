const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLoginForm);
router.post('/register', authController.register);
router.get('/register', authController.showRegisterForm);

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/dashboard', authController.dashboard);
router.get('/header', authController.showHeadersPage); 

module.exports = router;
