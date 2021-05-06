const {admin} = require("../util/admin");
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
const {validateLoginData} = require("../util/validators");
const {validateSignupData} = require("../util/validators");
firebase.initializeApp(firebaseConfig);


exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const {valid, errors} = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

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

    const {valid, errors} = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

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
