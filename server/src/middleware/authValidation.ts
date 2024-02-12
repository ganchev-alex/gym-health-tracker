import jwt = require("jsonwebtoken");
import express = require("express");
import ResError from "../util/ResError";

const TOKEN_SECRET_KEY = "c!q1^g5Zt%y@r*3B";

const authValidation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new ResError(
      "\n- func. authValidaton: No authorization header was detected.\n User Not Authorized!",
      401
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, TOKEN_SECRET_KEY);
  } catch (err) {
    const error = new ResError(
      "\n- func. decodingToken (authValidation): Token was not decoded properly.\nError: " +
        err
    );
    return next(error);
  }

  if (!decodedToken) {
    return res.status(401).json({
      message: "Not Authenticated!",
    });
  }

  (req as any).userId = decodedToken.userId;
  next();
};

export default authValidation;
export { TOKEN_SECRET_KEY };
