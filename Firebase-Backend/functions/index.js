const functions = require("firebase-functions");

require("dotenv").config({path: __dirname + "/.env"});


const {FirebaseAuth} = require("./util/firebaseAuth");
const express = require("express");
const {login} = require("./handlers/users");
const {signup} = require("./handlers/users");

const app = express();


const {admin} = require("./util/admin");


// test route for hello world
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello world from Firebase!");
});

// signup route
app.post("/signup", signup);

// login route
app.post("/login", login);


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

// eslint-disable-next-line max-len
// TODO: Even after deleting email account on firebase console, can still post posts with token.
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
