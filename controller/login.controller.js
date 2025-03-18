const passport = require('passport');
const nodemailer = require('nodemailer'); // Use Nodemailer to send emails
const crypto = require('crypto'); // Only declare once
const db = require('../db'); // Only declare once
const bcrypt = require('bcrypt');

// Handle login
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

// Handle forgot password
const handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
        req.flash('error', 'No account with that email address exists.');
        return res.redirect('/signup');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000);// 1 hour

    await db.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiration },
    });

    // Send email with reset link
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Example with Gmail
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
        to: email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
console.log(resetUrl);
    req.flash('info', 'Check your email for the password reset link.');
    //res.redirect('/login');
};

// Handle reset password
const handleResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const user = await db.user.findUnique({
        where: { resetToken: token },
    });

    if (!user || user.resetTokenExpiration < Date.now()) {
        req.flash('error', 'Invalid or expired reset token.');
        return res.redirect(`/reset-password/${token}`);
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect(`/reset-password/${token}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { resetToken: token },
        data: {
            password: hashedPassword,
            resetToken: null, // Clear the reset token
            resetTokenExpiration: null, // Clear the expiration
        },
    });

    req.flash('info', 'Password successfully reset. You can now log in.');
    res.redirect('/login');
};

module.exports = { handleLogin, handleForgotPassword, handleResetPassword };
