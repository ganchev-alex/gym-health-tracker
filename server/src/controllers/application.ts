import express = require("express");
import User from "../models/user";

const userData = async (req: express.Request, res: express.Response) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);

    if (user) {
      const appData = {
        auth: { email: user.auth.email },
        personalDetails: {
          firstName: user.personalDetails.firstName,
          lastNamee: user.personalDetails.lastName,
          sex: user.personalDetails.sex,
          profilePicture: user.personalDetails.profilePicture,
        },
      };

      return res.status(200).json({
        message: `User was found: ${userId}`,
        appData,
      });
    } else {
      return res.status(404).json({
        message: `User was not found!`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

const application = {
  userData,
};

export default application;
