const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route GET api/users/test
// @desc tests users route
// @access public
router.get('/test', (req, res) => res.json({msg: "Users Works!"}));

// @route GET api/users/register
// @desc Register user
// @access public
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: 'email already exists'});
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar,
                });
            }
        });
});

module.exports = router;