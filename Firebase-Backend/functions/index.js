const functions = require("firebase-functions");
const express = require("express");
const {admin} = require("./util/admin");

const {FirebaseAuth} = require("./util/firebaseAuth");
const {login, signup, uploadImage, addUserDetails,
    getAuthenticatedUser, getUserDetails, markNotificationsRead} =
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
app.get("/user", FirebaseAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/user", FirebaseAuth, addUserDetails);
app.post("/notifications", FirebaseAuth, markNotificationsRead);


// post routes
app.get("/posts", getAllPosts); // get all posts
// TODO: Even after deleting email account on firebase console,
//  can still post posts with token.
app.post("/posts", FirebaseAuth, createPost);
app.get("/posts/:postId", getPost); // get a specific post
app.delete("/posts/:postId", FirebaseAuth, deletePost);

// Comment routes
app.post("/posts/:postId/comment", FirebaseAuth, commentOnPost);

// like routes
app.post("/posts/:postId/like", FirebaseAuth, likePost);
app.post("/posts/:postId/unlike", FirebaseAuth, unlikePost);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
    .firestore.document("likes/{id}")
    .onCreate((snapshot) => {
        return admin.firestore()
            .doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if (
                    doc.exists &&
                    doc.data().userHandle !== snapshot.data().userHandle
                ) {
                    return admin.firestore()
                        // giving notification same id as the like
                        .doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: "like",
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .catch((err) => console.error(err));
    });

exports.deleteNotificationOnUnLike = functions
    .firestore.document("likes/{id}")
    .onDelete((snapshot) => {
        return admin.firestore()
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err);
            });
    });

exports.createNotificationOnComment = functions
    .firestore.document("comments/{id}")
    .onCreate((snapshot) => {
        return admin.firestore()
            .doc(`/posts/${snapshot.data().postId}`)
            .get()
            .then((doc) => {
                if (
                    doc.exists &&
                    doc.data().userHandle !== snapshot.data().userHandle
                ) {
                    return admin.firestore()
                        .doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: "comment",
                            read: false,
                            postId: doc.id
                        });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

// on delete post, delete corresponding likes and comments as well
exports.onPostDelete = functions
    .firestore.document("/posts/{postId}")
    .onDelete((snapshot, context) => {
        const postId = context.params.postId;
        const batch = admin.firestore().batch();
        return admin.firestore()
            .collection("comments")
            .where("postId", "==", postId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(admin.firestore().doc(`/comments/${doc.id}`));
                });
                return admin.firestore()
                    .collection("likes")
                    .where("postId", "==", postId)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(admin.firestore().doc(`/likes/${doc.id}`));
                });
                return admin.firestore()
                    .collection("notifications")
                    .where("postId", "==", postId)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(admin.firestore()
                        .doc(`/notifications/${doc.id}`));
                });
                return batch.commit();
            })
            .catch((err) => console.error(err));
    });
