import express = require("express");
import mongoose = require("mongoose");
import bodyParser = require("body-parser");

import exerciseRouter from "./routes/exercises";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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
