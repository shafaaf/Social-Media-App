const {admin} = require("../util/admin");

const FirebaseAuth = (req, res, next) => {
    let idToken;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
        idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
        console.error("No token found");
        res.status(403).json({
            error: "Auth token not found or formatted properly"
        });
    }
    // verify token
    admin.auth().verifyIdToken(idToken)
        .then((decodedIdToken) => {
            req.user = decodedIdToken; // put in decoded token req object
            console.log("decodedIdToken is: ", decodedIdToken);
            return admin.firestore().collection("users")
                .where("userUId", "==", req.user.uid).limit(1).get();
        })
        .then((data) => {
            console.log("data.docs is: ", data.docs);
            if (data.docs.length === 0) {
                throw new Error("Token not valid");
            }
            req.user.handle = data.docs[0].data().handle;
            // req.user.profilePicUrl = data.docs[0].data().profilePicUrl;
            return next();
        })
        .catch((err) => {
            console.error("Error while verifying token ", err);
            if (err.code === "auth/id-token-expired") {
                return res.status(403).json({
                    general: "Token has expired"
                });
            } else if (err.code === "auth/argument-error") {
                return res.status(403).json({
                    general: "Not a valid auth token"
                });
            } else {
                console.log("err is: ", err);
                const test = {
                    general: err.message
                };
                return res.status(403).json(test);
            }
        });
};

exports.FirebaseAuth = FirebaseAuth;
