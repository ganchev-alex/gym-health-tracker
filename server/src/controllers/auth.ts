import express = require("express");
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");

import User from "../models/user";

const TOKEN_SECRET_KEY = "c!q1^g5Zt%y@r*3B";

interface checkEmailRequest {
  email: string;
}

interface singInRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: string;
  sex: string;
  weight: string;
  height: string;
}

export const checkEmail = async (
  req: express.Request<{}, {}, checkEmailRequest>,
  res: express.Response
) => {
  try {
    const { email } = req.body;

    const userMatch = await User.findOne({ "auth.email": email });
    console.log("User match: ", userMatch);
    if (userMatch) {
      console.log(409);
      return res.status(409).json({
        message: "Email already in use!",
        email: userMatch.auth.email,
      });
    } else {
      return res.status(200).json({
        message:
          "User with this email does not exist, thus it can be used for the creation of a new account.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error! Something went wrong.",
      error,
    });
  }
};

export const signIn = async (
  req: express.Request<{}, {}, singInRequest>,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;
    const { firstName, lastName, age, sex, weight, height } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const userAuthData = { email, password: hashedPassword };
    // req.file.path.replace('\\', '/')
    const personalDetails = {
      firstName,
      lastName,
      age: Number(age),
      sex,
      profilePicture: req.file.path.replace("\\", "/"),
      weight: Number(weight),
      height: Number(height),
    };
    const user = new User({ auth: userAuthData, personalDetails });
    const result = await user.save();

    const token = jwt.sign(
      {
        email: result.auth.email,
        userId: result._id.toString(),
      },
      TOKEN_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({
      message: "User was successfully added and created!",
      description:
        "You have added the email and the password to the data of the currant user.",
      token: token,
      userId: result._id.toString(),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error. Something went wrong! ",
      error: error.message,
    });
  }
};

const authController = {
  signIn,
  checkEmail,
};

export default authController;
