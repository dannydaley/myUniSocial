const express = require("express");
const bodyParser = require("body-parser");

var session = require("cookie-session");

const app = express();
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));

const oneDay = 1000 * 60 * 60 * 24;

// const session = require("express-session");
//ORIGNALLL
// Session setup
// app.use(
//     session({
//         key: "user_id",
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: true,
//         cookie: { maxAge: oneDay },
//     })
// );
app.use(cookieParser());
// Session setup
app.use(
    session({
        name: "session",
        keys: ["user_id", ""],
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
