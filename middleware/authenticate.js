const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.sessionToken;
    if (!token) {
        return res.status(401).send('Authentication failed: token not found');
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken; // Définir req.user avec les informations de l'utilisateur
        next();
    } catch (error) {
        return res.status(401).send('Authentication failed: invalid token');
    }
}

module.exports = authenticate;
