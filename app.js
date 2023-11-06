// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/user_auth', { useNewUrlParser: true, useUnifiedTopology: true });

// Configure Passport
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Unknown user' });
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
        return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/auth/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/auth/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ user: req.user, message: 'Login successful.' });
});

app.get('/auth/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logout successful.' });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
