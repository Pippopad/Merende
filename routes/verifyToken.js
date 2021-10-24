const jwt = require('jsonwebtoken');
const internal = require('stream');

const verifyToken = (req, res, next) => {
    var auth = req.headers.token;

    if (!auth) return res.status(401).json("Unauthorized!");
    
    auth = auth.split(" ")[1];

    jwt.verify(auth, process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token!" });

        req.user = user;
        next();
    });
};

const verifyAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userId == req.params.userId || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).send({ message: "You are not allowed to perfom this action!" });
        }
    })
};

const verifyNotAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.attribute != "admin") {
            next();
        } else {
            return res.status(403).send({ message: "You are not allowed to perfom this action!" });
        }
    })
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.attribute == "admin") {
            next();
        } else {
            return res.status(403).send({ message: "You are not allowed to perfom this action!" });
        }
    })
};

module.exports = { verifyToken, verifyAuthorization, verifyNotAdmin, verifyAdmin };
