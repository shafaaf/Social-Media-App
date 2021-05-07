const functions = require("firebase-functions");
const express = require("express");

const {FirebaseAuth} = require("./util/firebaseAuth");
const {login, signup, uploadImage, addUserDetails, getUserDetails} =
    require("./handlers/users");
const {createPost, getAllPosts, getPost} = require("./handlers/posts");

const app = express();

// test route for hello world
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello world from Firebase!");
});

// auth routes
app.post("/signup", signup);
app.post("/login", login);

// user routes
app.post("/user/image", FirebaseAuth, uploadImage);
app.post("/user", FirebaseAuth, addUserDetails);
app.get("/user", FirebaseAuth, getUserDetails);

// post routes
app.get("/posts", getAllPosts); // get all posts
app.get("/posts/:postId", getPost); // get specific post
// TODO: Even after deleting email account on firebase console,
//  can still post posts with token.
app.post("/posts", FirebaseAuth, createPost);

// TODOs
// delete a post
// like a post
// unlike a post
// comment on a post

exports.api = functions.https.onRequest(app);
