const isEmpty = (string) => {
    if (string.trim() === "") return true;
    else return false;
};

const isEmail = (email) => {
    // eslint-disable-next-line max-len
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

exports.isEmpty = isEmpty;
exports.isEmail = isEmail;
