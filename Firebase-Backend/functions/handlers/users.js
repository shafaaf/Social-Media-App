const {admin} = require("../util/admin");

require("dotenv").config();

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
const {extractUserDetails} = require("../util/validators");
const {validateLoginData} = require("../util/validators");
const {validateSignupData} = require("../util/validators");
firebase.initializeApp(firebaseConfig);
console.log("firebaseConfig is: ", firebaseConfig);

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const {valid, errors} = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

    const noImageName = "no-image.png";

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
                            profilePicUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImageName}?alt=media`,
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
// Upload a profile image for user
exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");

    const busboy = new BusBoy({headers: req.headers});

    let imageToBeUploaded = {};
    let imageFileName;

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, file, filename, encoding, mimetype);
        if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
            return res.status(400).json({error: "File type not supported"});
        }
        // my.image.png => ['my', 'image', 'png']
        // eslint-disable-next-line max-len
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        // 32756238461724837.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
        ).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then(() => {
                // Append token to url
                const profilePicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
                return admin.firestore().doc(`/users/${req.user.handle}`)
                    .update({profilePicUrl});
            })
            .then(() => {
                return res.json({message: "image uploaded successfully"});
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({error: "something went wrong"});
            });
    });
    busboy.end(req.rawBody);
};

exports.addUserDetails = (req, res) => {
    const userDetails = extractUserDetails(req.body);
    admin.firestore().doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({message: "Details added successfully"});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};

// Get own user details
exports.getUserDetails = (req, res) => {
    const userData = {};
    admin.firestore().doc(`/users/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.credentials = doc.data();
                // get this user's likes
                return admin.firestore()
                    .collection("likes")
                    .where("userHandle", "==", req.user.handle)
                    .get();
            }
        })
        .then((data) => {
            userData.likes = [];
            data.forEach((doc) => {
                userData.likes.push(doc.data());
            });
            return res.json(userData);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};
