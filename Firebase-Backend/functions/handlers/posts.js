const {admin} = require("../util/admin");

exports.getPosts = (req, res) => {
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
