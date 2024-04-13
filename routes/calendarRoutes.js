const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authenticate');

router.get('/', function(req, res) {
    res.render('calendar', { title: 'Votre titre ici' });
});
module.exports = router;
