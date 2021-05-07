const functions = require("firebase-functions");
const express = require("express");

require("dotenv").config({path: __dirname + "/.env"});

const {FirebaseAuth} = require("./util/firebaseAuth");
const {login, signup, uploadImage, addUserDetails} =
    require("./handlers/users");

const {createPost} = require("./handlers/posts");
const {getPosts} = require("./handlers/posts");

const app = express();

// test route for hello world
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello world from Firebase!");
});

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FirebaseAuth, uploadImage);
app.post("/user", FirebaseAuth, addUserDetails);

// post routes
app.get("/posts", getPosts);
// TODO: Even after deleting email account on firebase console,
//  can still post posts with token.
app.post("/posts", FirebaseAuth, createPost);

exports.api = functions.https.onRequest(app);
