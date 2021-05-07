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
    console.log("Im here1");
    admin.firestore().doc(`/posts/${req.params.postId}`)
        .get()
        .then((doc) => {
            console.log("Im here2");
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
            console.log("Im here3");
            console.error(err);
            res.status(500).json({error: err.code});
        });
};

exports.createPost = (req, res) => {
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
};
