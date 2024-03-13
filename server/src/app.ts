import express = require("express");
import mongoose = require("mongoose");
import bodyParser = require("body-parser");
import multer = require("multer");
import crypto = require("crypto");
import path = require("path");

import exerciseRouter from "./routes/exercises";
import authRouter from "./routes/auth";
import applicationRouter from "./routes/application";
import essentialsRouter from "./routes/essentials";
import exploreRouter from "./routes/explore";
import statsRouter from "./routes/statistics";

import ResError from "./util/ResError";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "profilePictures");
  },
  filename: (req, file, callback) => {
    crypto.randomBytes(10, (error, buffer) => {
      if (error) {
        throw error;
      }
      const parts = file.originalname.split(".");
      const extension = parts[parts.length - 1];
      const fileName = buffer.toString("hex") + "." + extension;
      callback(null, fileName);
    });
  },
});

const fileFilter = (req, file, callback) => {
  const allowedExtensions = ["image/jpg", "image/jpeg", "image/png"];
  if (allowedExtensions.includes(file.mimetype)) {
    callback(null, true);
  } else {
    return callback(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  "/profilePictures",
  express.static(path.join(__dirname, "../profilePictures"))
);
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single(
    "profilePicture"
  )
);

app.use((req: express.Request, res: express.Response, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return next();
});

app.use("/auth", authRouter);
app.use("/app", applicationRouter);
app.use("/ess", essentialsRouter);
app.use("/exercise", exerciseRouter);
app.use("/explore", exploreRouter);
app.use("/stats", statsRouter);

app.use((error: ResError, req: express.Request, res: express.Response) => {
  if (error.message) {
    console.log(error.message);
    return res.status(error.status).json({
      message:
        error.status == 500
          ? "Internal Server Error: "
          : "Something went wrong. Error: " + error.message,
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://aganchev:rwUBOOO79gI3DeN7@projectmanager.jjnszh2.mongodb.net/WorkoutTrackerApplication?retryWrites=true&w=majority"
  )
  .then((connectionResult) => {
    if (!connectionResult) {
      throw new Error("The server is not working at the moment.");
    }
    console.log("Succesfull connection to the database!");
    app.listen(8080);
  })
  .catch((error) => {
    console.log("Couldn't connect to the database. \nError: ", error);
  });
