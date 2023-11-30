import express = require("express");
import mongoose = require("mongoose");
import bodyParser = require("body-parser");
import multer = require("multer");
import crypto = require("crypto");
import path = require("path");

import exerciseRouter from "./routes/exercises";
import authRouter from "./routes/auth";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "userData/profilePictures");
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
  "/userData/profilePictures",
  express.static(path.join(__dirname, "/userData/profilePictures"))
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
  next();
});

app.use("/auth", authRouter);
app.use("/exercises", exerciseRouter);

mongoose
  .connect(
    "mongodb+srv://aganchev:vytLbwSQFjvAZqoJ@projectmanager.jjnszh2.mongodb.net/WorkoutTrackerApplication?retryWrites=true&w=majority"
  )
  .then((connectionResult) => {
    if (!connectionResult) {
      throw new Error("The server is not working at the moment.");
    }
    console.log("Succesfull connection to the database!");
    app.listen(8080);
  })
  .catch((error) => {
    console.log(error);
  });
