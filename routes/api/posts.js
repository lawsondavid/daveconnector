const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

// @route GET api/posts/test
// @desc tests posts route
// @access public
router.get('/test', (req, res) => res.json({msg: "posts works!"}));

// @route GET api/posts
// @desc List posts
// @access public
router.get('/', (req, res) => {
    Post.find().sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json({msg: "Error getting posts"}));
});

// @route GET api/posts/:id
// @desc Retrieve post with provided id
// @access public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => {
            console.log(`An error occurred ${err}`);
            res.status(404).json({msg: "Error getting post"});
        });
});

// @route POST api/posts
// @desc Create post
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    if (!isValid) {
        req.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post));
});
module.exports = router;