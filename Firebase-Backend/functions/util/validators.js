const isEmpty = (string) => {
    if (string === null || string === undefined) {
        return true;
    }
    if (string.trim() === "") return true;
    else return false;
};

const isEmail = (email) => {
    // eslint-disable-next-line max-len
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

exports.validateSignupData = (data) => {
    const errors = {};
    if (isEmpty(data.email)) {
        errors.email = "Must not be empty";
    } else if (!isEmail(data.email)) {
        errors.email = "Must be a valid email address";
    }
    if (isEmpty(data.password)) errors.password = "Must not be empty";
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
    }
    if (isEmpty(data.handle)) errors.handle = "Must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.validateLoginData = (data) => {
    const errors = {};
    if (isEmpty(data.email)) errors.email = "Must not be empty";
    if (isEmpty(data.password)) errors.password = "Must not be empty";
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.extractUserDetails = (data) => {
    const userDetails = {};
    if (!isEmpty(data.bio)) {
        data.bio.trim();
        userDetails.bio = data.bio;
    }
    if (!isEmpty(data.website)) {
        if (data.website.trim().substring(0, 4) !== "http") {
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }
    if (!isEmpty(data.location)) {
        userDetails.location = data.location.trim();
    }
    return userDetails;
};
