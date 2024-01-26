"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_SECRET_KEY = void 0;
const jwt = require("jsonwebtoken");
const TOKEN_SECRET_KEY = "c!q1^g5Zt%y@r*3B";
exports.TOKEN_SECRET_KEY = TOKEN_SECRET_KEY;
const authValidation = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        console.log("Not authrozied: 401");
        return res.status(401).json({
            message: "Not Authorized!",
        });
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, TOKEN_SECRET_KEY);
        console.log(decodedToken);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed authentication!",
            error: error.message,
        });
    }
    if (!decodedToken) {
        return res.status(401).json({
            message: "Not Authenticated!",
        });
    }
    req.userId = decodedToken.userId;
    next();
};
exports.default = authValidation;
//# sourceMappingURL=authValidation.js.map