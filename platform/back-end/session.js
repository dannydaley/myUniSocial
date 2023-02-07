const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
    session({
        key: "user_id",
        secret: "i9nrPdfIKEAb?8&#cK",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Max age one day
        },
    })
);

module.exports = app;
