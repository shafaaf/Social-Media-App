const {isEmpty, sanitizeString} = require("../util/utils");
const {admin} = require("../util/admin");

exports.getAllPosts = (req, res) => {
    admin.firestore()
        .collection("posts")
        .orderBy("createdAt", "desc")
        .get()
        .then((data) => {
            const posts = [];
            const promiseList = [];
            data.forEach((doc) => {
                promiseList.push(
                    new Promise((resolve, reject) => {
                        console.log(doc.id, " => ", doc.data());
                        const userHandle = doc.data().userHandle;
                        getProfilePicUrl(userHandle)
                            .then((profilePicUrl) => {
                                posts.push({
                                    postId: doc.id,
                                    body: doc.data().body,
                                    userHandle: doc.data().userHandle,
                                    createdAt: doc.data().createdAt,
                                    profilePicUrl: profilePicUrl
                                });
                                resolve();
                            })
                            .catch((e) => {
                                reject(e);
                            });
                    })
                );
            });
            console.log("HERE");
            console.log("promiseList is: ", promiseList);
            Promise.all(promiseList)
                .then(() => {
                    console.log("posts is: ", posts);
                    return res.json(posts);
                });
        })
        .catch((e) => {
            console.error(e);
            res.status(500).json({error: "error getting all posts"});
        });
};

const getProfilePicUrl = (userHandle) => {
    return new Promise((resolve, reject) => {
        admin.firestore().doc(`/users/${userHandle}`)
            .get()
            .then((userDoc) => {
                console.log("userDoc.data(): ", userDoc.data());
                if (userDoc.exists) {
                    return resolve(userDoc.data().profilePicUrl);
                } else {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject("Weird error: No profile pic of user");
                }
            });
    });
};

exports.getPost = (req, res) => {
    let postData = {};
    admin.firestore().doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({error: "Post not found"});
            }
            postData = doc.data();
            postData.postId = doc.id;
            return admin.firestore()
                .collection("comments")
                .orderBy("createdAt", "desc")
                .where("postId", "==", req.params.postId)
                .get();
        })
        .then((data) => {
            postData.comments = [];
            data.forEach((doc) => {
                postData.comments.push(doc.data());
            });
            return res.json(postData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
};

exports.createPost = (req, res) => {
    if (isEmpty(req.body.body)) {
        return res.status(400).json({post: "Must not be empty"});
    }
    req.body.body = sanitizeString(req.body.body);

    const newPost = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    admin.firestore().collection("posts").add(newPost)
        .then((doc) => {
            const resPost = newPost;
            resPost.postId = doc.id;
            res.json(resPost);
        })
        .catch((e) => {
            console.log(e);
            res.status(400)
                .json({
                    error: "something went wrong"
                });
        });
};

exports.commentOnPost = (req, res) => {
    if (isEmpty(req.body.body)) {
        return res.status(400).json({comment: "Must not be empty"});
    }
    req.body.body = sanitizeString(req.body.body);

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        userHandle: req.user.handle
    };
    console.log(newComment);

    admin.firestore().doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({error: "Post not found"});
            }
            return doc.ref.update({commentCount: doc.data().commentCount + 1});
        })
        .then(() => {
            return admin.firestore().collection("comments").add(newComment);
        })
        .then(() => {
            res.json(newComment);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: "Something went wrong"});
        });
};

exports.likePost = (req, res) => {
    const postDocument = admin.firestore().doc(`/posts/${req.params.postId}`);
    let postData;

    postDocument.get()
        .then((doc) => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;

                const likeDocument = admin.firestore()
                    .collection("likes")
                    .where("userHandle", "==", req.user.handle)
                    .where("postId", "==", req.params.postId)
                    .limit(1);
                return likeDocument.get();
            } else {
                return res.status(404).json({error: "Post not found"});
            }
        })
        .then((data) => {
            if (data.empty) { // no like document by user for this post
                return admin.firestore()
                    .collection("likes")
                    .add({
                        postId: req.params.postId,
                        userHandle: req.user.handle
                    })
                    .then(() => {
                        postData.likeCount++;
                        return postDocument.update({
                            likeCount: postData.likeCount
                        });
                    })
                    .then(() => {
                        return res.json(postData);
                    });
            } else { // like document by user for this post exists already
                return res.status(400).json({error: "Post already liked"});
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
};

exports.unlikePost = (req, res) => {
    const postDocument = admin.firestore().doc(`/posts/${req.params.postId}`);
    let postData;

    postDocument.get()
        .then((doc) => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                const likeDocument = admin.firestore()
                    .collection("likes")
                    .where("userHandle", "==", req.user.handle)
                    .where("postId", "==", req.params.postId)
                    .limit(1);
                return likeDocument.get();
            } else {
                return res.status(404).json({error: "Post not found"});
            }
        })
        .then((data) => {
            if (data.empty) { // no like document by user for this post
                return res.status(400).json({error: "Post not liked"});
            } else { // like document by user for this post exists
                return admin.firestore()
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        postData.likeCount--;
                        return postDocument.update({
                            likeCount: postData.likeCount
                        });
                    })
                    .then(() => {
                        res.json(postData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err.code});
        });
};

exports.deletePost = (req, res) => {
    const document = admin.firestore().doc(`/posts/${req.params.postId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({error: "Post not found"});
            }
            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({
                    error: "Unauthorized. Dont own the post"
                });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({message: "Post deleted successfully"});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
};
