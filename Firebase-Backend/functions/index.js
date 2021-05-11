const functions = require("firebase-functions");
const express = require("express");
const {admin} = require("./util/admin");
const cors = require("cors");

const {FirebaseAuth} = require("./util/firebaseAuth");

const {login, signup, uploadImage, addUserDetails,
    getAuthenticatedUser, getUserDetails, markNotificationsRead} =
        require("./handlers/users");

const {createPost, getAllPosts, getPost, deletePost, commentOnPost,
    unlikePost, likePost} = require("./handlers/posts");

const app = express();
app.use(cors());

// test route for hello world
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello world from Firebase!");
});

// authentication routes
app.post("/signup", signup);
app.post("/login", login);

// user routes
app.post("/user/image", FirebaseAuth, uploadImage);
app.get("/user", FirebaseAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/user", FirebaseAuth, addUserDetails); // maybe use :userId
app.post("/notifications", FirebaseAuth, markNotificationsRead);


// post routes
app.get("/posts", getAllPosts);
// TODO: Even after deleting email account on firebase console,
//  can still post posts with token.
app.post("/posts", FirebaseAuth, createPost);
app.get("/posts/:postId", getPost);
app.delete("/posts/:postId", FirebaseAuth, deletePost);

// Comment routes
app.post("/posts/:postId/comment", FirebaseAuth, commentOnPost);
// like routes
app.post("/posts/:postId/like", FirebaseAuth, likePost);
app.post("/posts/:postId/unlike", FirebaseAuth, unlikePost);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions
    .firestore.document("likes/{id}")
    .onCreate((likeSnapshot) => {
        return admin.firestore()
            .doc(`/posts/${likeSnapshot.data().postId}`)
            .get()
            .then((postDoc) => {
                if (
                    postDoc.exists &&
                    postDoc.data().userHandle !== likeSnapshot.data().userHandle
                ) {
                    return admin.firestore()
                        // giving notification same id as the like
                        .doc(`/notifications/${likeSnapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: postDoc.data().userHandle,
                            sender: likeSnapshot.data().userHandle,
                            type: "like",
                            read: false,
                            postId: postDoc.id
                        });
                }
            })
            .catch((err) => console.error(err));
    });

exports.deleteNotificationOnUnLike = functions
    .firestore.document("likes/{id}")
    .onDelete((unlikeSnapshot) => {
        return admin.firestore()
            .doc(`/notifications/${unlikeSnapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err);
            });
    });

exports.createNotificationOnComment = functions
    .firestore.document("comments/{id}")
    .onCreate((commentSnapshot) => {
        return admin.firestore()
            .doc(`/posts/${commentSnapshot.data().postId}`)
            .get()
            .then((postDoc) => {
                if (postDoc.exists && postDoc.data().userHandle !==
                    commentSnapshot.data().userHandle
                ) {
                    return admin.firestore()
                        .doc(`/notifications/${commentSnapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: postDoc.data().userHandle,
                            sender: commentSnapshot.data().userHandle,
                            type: "comment",
                            read: false,
                            postId: postDoc.id
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
        return admin.firestore() // delete comments
            .collection("comments")
            .where("postId", "==", postId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(admin.firestore().doc(`/comments/${doc.id}`));
                });
                return admin.firestore() // delete likes
                    .collection("likes")
                    .where("postId", "==", postId)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(admin.firestore().doc(`/likes/${doc.id}`));
                });
                return admin.firestore()// delete notification
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
