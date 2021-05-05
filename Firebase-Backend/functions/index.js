const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

require("dotenv").config({path: __dirname + "/.env"});

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

const express = require("express");
const app = express();


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

// test route for hello world
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello world from Firebase!");
});

// signup route
app.post("/signup", (req, res) => {
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
            }
        });
});

// login route
app.post("/login", (req, res) => {
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
});

const FirebaseAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        console.error("No token found");
        res.status(403).json({error: "Unauthorized request"});
    }
    // verify token
    admin.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            req.user = decodedIdToken; // put in decoded token req object
            console.log("decodedIdToken is: ", decodedIdToken);
            return admin.firestore().collection("users")
                .where("userUId", "==", req.user.uid).limit(1).get();
        })
        .then((data) => {
            req.user.handle = data.docs[0].data().handle;
            return next();
        })
        .catch((err) => {
            console.error("Error while verifying token ", err);
            if (err.code === "auth/id-token-expired") {
                return res.status(403).json({
                    general: "Token has expired"
                });
            }
            return res.status(403).json(err);
        });
};

// get all posts
app.get("/posts", (req, res) => {
    admin.firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            const posts = [];
            data.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                posts.push({
                    postId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(posts);
        })
        .catch((e) => console.error(e));
});

app.post("/posts", FirebaseAuth, (req, res) => {
    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };

    admin.firestore().collection("posts").add(newPost)
        .then((doc) => {
            res.json({
                message: `document: ${doc.id} created successfully!`
            });
        })
        .catch((e) => {
            console.log(e);
            res.status(400)
                .json({
                    error: "something went wrong"
                });
        });
});

exports.api = functions.https.onRequest(app);
