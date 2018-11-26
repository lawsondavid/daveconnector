const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/profile');
//const User = require('../../models/user');

// @route GET api/profile/test
// @desc tests profile route
// @access public
router.get('/test', (req, res) => res.json({msg: "profile Works!"}));

// @route GET api/profile
// @desc Get current user's profile
// @access private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
              res.json(profile);
            } else {
                errors.noprofile = 'There is no profile for this user';
                return res.status(400).json(errors);
            }
        })
        .catch(err => res.status(500).json(err))
});

module.exports = router;
