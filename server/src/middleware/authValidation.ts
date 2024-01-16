import jwt = require("jsonwebtoken");
import express = require("express");

const TOKEN_SECRET_KEY = "c!q1^g5Zt%y@r*3B";

const authValidation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
  } catch (error) {
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

  (req as any).userId = decodedToken.userId;
  next();
};

export default authValidation;
export { TOKEN_SECRET_KEY };
