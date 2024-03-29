const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Utilisez la méthode GET pour la route /login
router.get('/login', authController.showLoginForm);
router.post('/register', authController.register);
router.get('/register', authController.showRegisterForm);

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/dashboard', authController.dashboard);
router.get('/header', authController.showHeadersPage); // Utilisez /headers au lieu de /header


module.exports = router;
