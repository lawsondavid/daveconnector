const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// @route GET api/profile/test
// @desc tests profile route
// @access public
router.get('/test', (req, res) => res.json({msg: "profile Works!"}));

// @route GET api/profile
// @desc Get current user's profile
// @access private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    let errors = {};
    Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
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


// @route GET api/profile/handle/:handle
// @desc Get profile by handle
// @access public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
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

// @route GET api/profile/all
// @desc Gets all handle
// @access public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (profiles) {
                res.json(profiles);
            } else {
                errors.noprofile = 'There are no profiles';
                return res.status(400).json(errors);
            }
        })
        .catch(err => res.status(500).json({noprofile: "There are no profiles."}))
});


// @route GET api/profile/user/:user_id
// @desc Get profile by handle
// @access public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
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


// @route POST api/profile
// @desc create or edit user profile
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        res.status('400').json(errors);
    }

    const profileFields = {social: {}};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== undefined) profileFields.skills = req.body.skills.split(',');

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                Profile.findOneAndUpdate(
                    {user: req.user.id}, {$set: profileFields}, {new: true}
                ).then(profile => res.json(profile));
            } else {
                Profile.findOne({handle: profileFields.handle}).then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exists';
                        res.status(400).json(errors);
                    } else {
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    }
                })
            }
        })
});

// @route POST api/profile/experience
// @desc Adds an experience to the current users profile
// @access private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateExperienceInput(req.body);

    if (!isValid) {
        res.status('400').json(errors);
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                const newExp = {
                    title: req.body.title,
                    company: req.body.company,
                    location: req.body.location,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                };
                profile.experience.unshift(newExp);
                profile.save().then(res.json(profile));

            } else {
                res.status(404).json({msg: "No profile"});
            }
        })
});

// @route POST api/profile/education
// @desc Adds an education to the current users profile
// @access private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateEducationInput(req.body);

    if (!isValid) {
        res.status('400').json(errors);
    }

    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                const newEdu = {
                    school: req.body.school,
                    degree: req.body.degree,
                    fieldofstudy: req.body.fieldofstudy,
                    from: req.body.from,
                    to: req.body.to,
                    current: req.body.current,
                    description: req.body.description
                };
                profile.education.unshift(newEdu);
                profile.save().then(res.json(profile));
            } else {
                res.status(404).json({msg: "No profile"});
            }
        })
});

// @route DELETE api/profile/experience/:exp_id
// @desc Deletes an experience from the current users profile
// @access private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                const removeIndex = profile.experience
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);

                profile.experience.splice(removeIndex, 1);
                profile.save().then(profile => res.json(profile));
            } else {
                res.status(404).json({msg: "No profile"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg: 'Something went wrong'});
        })
});

// @route DELETE api/profile/education/:edu_id
// @desc Deletes an education from the current users profile
// @access private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile) {
                const removeIndex = profile.education
                    .map(item => item.id)
                    .indexOf(req.params.exp_id);

                profile.education.splice(removeIndex, 1);
                profile.save().then(profile => res.json(profile));
            } else {
                res.status(404).json({msg: "No profile"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg: 'Something went wrong'});
        })
});


// @route DELETE api/profile
// @desc Deletes user and profile
// @access private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOneAndRemove({user: req.user.id})
        .then(() => {
           User.findOneAndRemove({_id: req.user.id}).then(() => res.json({success: true}));
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({msg: 'Something went wrong'});
        })
});

module.exports = router;
