const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const crypto = require('crypto'); 

const authController = {
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).send("Username, email, and password are required");
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send("User with this email already exists");
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

    async addAdmin(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).send("Username, email, and password are required");
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).send("User with this email already exists");
            }

            const user = new User({ username, email, password, role: 'admin' });
            await user.save();

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

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            
            res.cookie('sessionToken', token, { httpOnly: true }); 
    
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
        res.render('base'); 
    },
    async showRegisterForm(req, res) {
        const error = req.session.error; 
        req.session.error = null;
        res.render('register', { error: error });
    },

    showHeadersPage(req, res) {
        const user = req.session.user;
        res.render('header', { user: user }); 

    } 
    
};
module.exports = authController;
