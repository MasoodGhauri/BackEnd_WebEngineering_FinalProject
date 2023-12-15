const jwt = require('jsonwebtoken');

let VerifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ "Success": false, "Message": "No token provided" });
    }
    else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ "Success": false, "Message": "Invalid token" });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
}


let verifyTokenExiry = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ "Success": false, "Message": "No token provided" });
    }
    else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ "Success": false, "Message": "Invalid token" });

            }
            else {
                res.status(200).json({ "Success": true, "Message": "Token is valid" });
            }
        });
    }
}


let VerifyAdmin = (req, res, next) => {
    if (req.decoded.role == "admin") {
        next();
    }
    else {
        res.status(401).json({ "Success": false, "Message": "Unauthorized Access" });
    }
}

module.exports = {
    VerifyToken,
    VerifyAdmin,
    verifyTokenExiry
}
