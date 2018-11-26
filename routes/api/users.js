const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');

// @route GET api/users/test
// @desc tests users route
// @access public
router.get('/test', (req, res) => res.json({msg: "Users Works!"}));

// @route GET api/users/register
// @desc Register user
// @access public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'email already exists'});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm', //default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        });
});

// @route GET api/users/login
// @desc Login user/Returning JWT
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if (!user) {
                return res.status(404).json({email: 'User not found'});
            }

            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    const payload = {id: user.id, name: user.name, avatar: user.avatar};
                    jwt.sign(payload,
                        keys.secretOrKey,
                        {expiresIn: 3600},
                        (err, token) => {
                            res.json({success: true, token: 'Bearer ' + token});
                        });
                } else {
                    return res.status(400).json({password: 'Invalid password'});
                }
            })
        });
});

// @route GET api/users/current
// @desc Return current user
// @access private
router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const user = req.user;
        res.json({id: user.id, name: user.name, email: user.email});
    }
);

module.exports = router;