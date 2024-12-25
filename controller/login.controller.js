const bcrypt = require('bcrypt');
const db = require('../db');
const passport = require('passport');

const handleLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            console.error("Authentication Error:", err);
            return next(err); 
        }
        if (!user) { 
            // Authentication failed, set flash message
            req.flash('error', info.message);
            return res.redirect('/login'); 
        }
        req.logIn(user, (err) => {
            if (err) { 
                console.error("Login Error:", err);
                return next(err); 
            }
            // Authentication successful, redirect to dashboard
            res.redirect('/dashboard');
        });
    })(req, res, next);
};

module.exports = { handleLogin };
