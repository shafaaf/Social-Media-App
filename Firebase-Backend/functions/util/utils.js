const isEmpty = (string) => {
    if (string === null || string === undefined) {
        return true;
    }
    if (string.trim() === "") return true;
    else return false;
};

const sanitizeString = (str) => {
    return str.trim();
};

const isEmail = (email) => {
    // eslint-disable-next-line max-len
    const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

module.exports = {
    isEmpty, isEmail, sanitizeString
};
