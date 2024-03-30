const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto'); // Add this line to import the crypto module

const authController = {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).send("Username, email, and password are required");
            }
            const user = new User({ username, email, password, role: 'user' });
            await user.save();
            // const token = res.headers.get('Authorization');
            // console.log('JWT Token:', token);  
            res.redirect('/auth/login');
        } catch (error) {
            res.status(400).send(error.message);
        }
    },


  
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(404).send('User not found');
            }  
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).send('Invalid password');
            } 

            // Si l'authentification est réussie, générez le token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            
            // Envoyez le token dans un cookie
            res.cookie('sessionToken', token, { httpOnly: true }); // Assurez-vous que le nom du cookie est correct
    
            // Redirigez l'utilisateur vers le tableau de bord approprié
            if (user.role === 'admin') {
                return res.redirect(`/auth/dashboard`);
            } else {
                return res.redirect('/auth/header');
            }
        } catch (err) {
            res.status(400).send(err.message);
        }
    },
    

    logout(req, res) {
        if (!req.session) {
            return res.status(500).send('Session is not initialized');
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/auth/login');
        });
    },

    dashboard(req, res) {
        const user = req.session.user;
        res.render('dashboard', { user: user });
    },

    showLoginForm(req, res) {
        res.render('base'); // Assurez-vous d'avoir un fichier ejs nommé login dans le dossier des vues
    },
    async showRegisterForm(req, res) {
        const error = req.session.error; // Récupérer l'erreur de la session si elle existe
        req.session.error = null; // Effacer l'erreur de la session après l'avoir récupérée
        res.render('register', { error: error }); // Passer l'erreur à la vue register.ejs
    },

    showHeadersPage(req, res) {
        // Récupérer l'utilisateur à partir de la session
        const user = req.session.user;
        res.render('header', { user: user }); 

    } 
    
};
module.exports = authController;
