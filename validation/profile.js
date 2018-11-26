const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {

    let errors = {};
    data.handle = isEmpty(data.handle) ? '' : data.handle;
    data.status = isEmpty(data.status) ? '' : data.status;
    data.skills = isEmpty(data.skills) ? '' : data.skills;

    if (!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Handle needs to be between 2 and 40 characters';
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Handle is required';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills is required'
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status is required'
    }

    if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
        errors.website = 'website is not a valid URL'
    }

    if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)) {
        errors.linkedin = 'linkedin is not a valid URL'
    }

    if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)) {
        errors.twitter = 'twitter is not a valid URL'
    }

    if (!isEmpty(data.youtube) && !Validator.isURL(data.youtube)) {
        errors.youtube = 'youtube is not a valid URL'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};