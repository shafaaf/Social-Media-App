const functions = require("firebase-functions");
const express = require("express");

const {FirebaseAuth} = require("./util/firebaseAuth");
const {login, signup, uploadImage, addUserDetails, getUserDetails} =
    require("./handlers/users");
const {createPost, getAllPosts, getPost, deletePost,
    commentOnPost, unlikePost, likePost} =
    require("./handlers/posts");

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
app.get("/user", FirebaseAuth, getUserDetails);
app.post("/user", FirebaseAuth, addUserDetails);


// post routes
app.get("/posts", getAllPosts); // get all posts
// TODO: Even after deleting email account on firebase console,
//  can still post posts with token.
app.post("/posts", FirebaseAuth, createPost);
app.get("/posts/:postId", getPost); // get a specific post
app.delete("/posts/:postId", FirebaseAuth, deletePost);

// Comment routes
// comment on a post
app.post("/posts/:postId/comment", FirebaseAuth, commentOnPost);

// like routes
app.post("/posts/:postId/like", FirebaseAuth, likePost);
app.post("/posts/:postId/unlike", FirebaseAuth, unlikePost);

// TODOs
// delete a post

exports.api = functions.https.onRequest(app);
