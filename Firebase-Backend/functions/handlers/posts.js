const {isEmpty, sanitizeString} = require("../util/utils");

const {admin} = require("../util/admin");

exports.getAllPosts = (req, res) => {
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

};

exports.unlikePost = (req, res) => {

};
