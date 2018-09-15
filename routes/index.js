const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const {
    esnsureAuthenticated,
    esnsureGuest
} = require('../helpers/auth');

router.get('/', esnsureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/dashboard', esnsureAuthenticated, (req, res) => {
    Story.find({
        user: req.user.id
    }).then(stories => {
        res.render('index/dashboard', {
            stories: stories
        });
    });
});

router.get('/about', (req, res) => {
    res.render('index/about');
});

module.exports = router;