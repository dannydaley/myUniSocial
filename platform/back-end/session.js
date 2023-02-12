const express = require("express");
const bodyParser = require("body-parser");

var session = require("cookie-session");
// const session = require("express-session");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const oneDay = 1000 * 60 * 60 * 24;

// Session setup
app.use(
    session({
        key: "user_id",
        secret: process.env.SESSION_SECRET,
        resave: false,
        originalMaxAge: 0,
        maxAge: 0,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: oneDay,
        },
    })
);

// Session setup

module.exports = app;
