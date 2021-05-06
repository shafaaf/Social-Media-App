const {admin} = require("../util/admin");
const {isEmail} = require("../util/validators");
const {isEmpty} = require("../util/validators");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);


exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    // TODO: Add validation that all keys are passed in

    const errors = {};

    // Validate email
    if (isEmpty(newUser.email)) {
        errors.email = "Must not be empty";
    } else if (!isEmail(newUser.email)) {
        errors.email = "Must be a valid email address";
    }

    // Validate passwords
    if (isEmpty(newUser.password)) {
        errors.password = "Must not be empty";
    }
    if (newUser.password !== newUser.confirmPassword) {
        errors.password = "Passwords must match";
    }
    if (isEmpty(newUser.handle)) {
        errors.handle = "Must not be empty";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    let tokenGlobal;
    let userUIdGlobal;

    admin.firestore().doc(`/users/${newUser.handle}`).get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({
                    handle: "this handle is already taken"
                });
            } else {
                return firebase.auth()
                    // eslint-disable-next-line max-len
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
                    .then((data) => {
                        // userUId and token relationship here
                        userUIdGlobal = data.user.uid;
                        return data.user.getIdToken();
                    })
                    .then((token) => {
                        tokenGlobal = token;
                        const userCredentials = {
                            handle: newUser.handle,
                            email: newUser.email,
                            createdAt: new Date().toISOString(),
                            userUId: userUIdGlobal
                        };
                        return admin.firestore().doc(`/users/${newUser.handle}`)
                            .set(userCredentials);
                    })
                    .then(() => {
                        return res.status(201).json({token: tokenGlobal});
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                return res.status(400).json({
                    email: "email is already in use"
                });
            }
            return res.status(500).json({
                error: error.code
            });
        });
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const errors = {};


    if (isEmpty(user.email)) {
        errors.email = "Must not be empty";
    } else if (!isEmail(user.email)) {
        errors.email = "Must be a valid email address";
    }

    if (isEmpty(user.password)) errors.password = "Must not be empty";

    if (Object.keys(errors).length > 0) return res.status(400).json(errors);


    // login the user
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token});
        })
        .catch((err) => {
            console.log(err);
            if (err.code === "auth/wrong-password") {
                return res.status(403).json({
                    general: "Wrong credentials, please try again."
                });
            } else if (err.code === "auth/user-not-found") {
                return res.status(403).json({
                    general: "User not found, please try again."
                });
            }
            return res.status(500).json({error: err.code});
        });
};
