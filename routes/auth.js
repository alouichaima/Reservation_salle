const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { username,email, password } = req.body;
        
        if (!username || !email ||!password) {
            return res.status(400).send("Username and password are required");
        }
        
        // Créer un nouvel utilisateur
        const user = new User({ username, email, password, role: 'user' });
        await user.save();
        
        res.redirect('/auth/login');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Adding an admin
router.post('/add-admin', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).send("Username, email, and password are required");
        }
        
        // Commenting out the check for admin role
        // if (req.user.role !== 'admin') {
        //     return res.status(403).send('Only admin can perform this action');
        // }
        
        const existingAdmin = await User.findOne({ role: 'admin' });
        
        if (existingAdmin) {
            return res.status(400).send('An admin already exists');
        }
        
        const admin = new User({ username, email, password, role: 'admin' });
        await admin.save();
        
        res.status(201).send('Admin created successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//user login 
router.post('/login',async (req,res)=>{
    try {
     const {username,password}=req.body;
     const user = await User.findOne({username: username});
     
     if(!user){
         return res.status(404).send('user not found')
     }
     const isPasswordMatch =await bcrypt.compare(password,user.password);
   if(!isPasswordMatch){
     return res.status(401).send('invalid password')
   }
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
    req.session.user = user; // Supposons que 'user' contient les informations de l'utilisateur

    res.redirect(`/auth/dashboard`);
} catch (err) {
     res.status(400).send(err.message)
    }
 });

 router.get('/logout', (req, res) => {
    // Vérifier si req.session est initialisée
    if (!req.session) {
        return res.status(500).send('Session is not initialized');
    }

    // Détruire la session de l'utilisateur
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Rediriger l'utilisateur vers la page de connexion ou une autre page
        res.redirect('/auth/login');
    });
});

// Route pour afficher le tableau de bord
router.get('/dashboard', (req, res) => {
    // Récupérer les informations de l'utilisateur à partir de la session
    const user = req.session.user;
    // Passer les informations de l'utilisateur au modèle EJS lors du rendu de la vue
    res.render('dashboard', { user: user }); 
  });
  

module.exports = router;