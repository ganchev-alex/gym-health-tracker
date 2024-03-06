"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_SECRET_KEY = void 0;
const jwt = require("jsonwebtoken");
const ResError_1 = __importDefault(require("../util/ResError"));
const TOKEN_SECRET_KEY = "c!q1^g5Zt%y@r*3B";
exports.TOKEN_SECRET_KEY = TOKEN_SECRET_KEY;
const authValidation = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new ResError_1.default("\n- func. authValidaton: No authorization header was detected.\n User Not Authorized!", 401);
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, TOKEN_SECRET_KEY);
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. decodingToken (authValidation): Token was not decoded properly.\nError: " +
            err);
        return next(error);
    }
    if (!decodedToken) {
        return res.status(401).json({
            message: "Not Authenticated!",
        });
    }
    req.userId = decodedToken.userId;
    return next();
};
exports.default = authValidation;
//# sourceMappingURL=authValidation.js.map