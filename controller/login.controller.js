const passport = require('passport');

const handleLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            console.error("Authentication Error:", err);
            return next(err); 
        }
        if (!user) { 
            req.flash('error', info.message);
            return res.redirect('/login'); 
        }
        req.login(user, (err) => {
            if (err) { 
                console.error("Login Error:", err);
                return next(err); 
            }
            req.session.passport.userId = user.id;
            res.redirect('/dashboard');
        });
    })(req, res, next);
};

module.exports = { handleLogin };
