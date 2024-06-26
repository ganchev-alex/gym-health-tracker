"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const exercises_1 = __importDefault(require("./routes/exercises"));
const auth_1 = __importDefault(require("./routes/auth"));
const application_1 = __importDefault(require("./routes/application"));
const essentials_1 = __importDefault(require("./routes/essentials"));
const explore_1 = __importDefault(require("./routes/explore"));
const statistics_1 = __importDefault(require("./routes/statistics"));
const account_1 = __importDefault(require("./routes/account"));
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
    }
    else {
        return callback(null, false);
    }
};
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(bodyParser.json());
app.use("/profilePictures", express.static(path.join(__dirname, "../profilePictures")));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("profilePicture"));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return next();
});
app.use("/auth", auth_1.default);
app.use("/app", application_1.default);
app.use("/ess", essentials_1.default);
app.use("/exercise", exercises_1.default);
app.use("/explore", explore_1.default);
app.use("/stats", statistics_1.default);
app.use("/account", account_1.default);
app.use((error, req, res) => {
    if (error.message) {
        console.log(error.message);
        return res.status(error.status).json({
            message: error.status == 500
                ? "Internal Server Error: "
                : "Something went wrong. Error: " + error.message,
        });
    }
});
mongoose
    .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@projectmanager.jjnszh2.mongodb.net/WorkoutTrackerApplication?retryWrites=true&w=majority`)
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
//# sourceMappingURL=app.js.map