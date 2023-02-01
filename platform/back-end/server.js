//#region SETUP

var express = require("express");
const app = express();
var dotenv = require("dotenv").config();
const cors = require("cors");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
var path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

//#region IMAGES AND IMAGE UPLOAD HANDLING

//set up multer middleware for image uploads
var multer = require("multer");

// set up storage for file uploads
const storage = multer.diskStorage({
    // set destination to public image directory
    destination: "public/images/uploads",
    filename: function (req, file, cb) {
        // create a unique suffix so that image names will never have a duplicate
        //suffix consists of the date, a hyphen and then a large random number
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "IMAGE-" + uniqueSuffix + ".png");
        // generate the file name of the file to be added to the public image directory
        // filename contains path to folder to make things easier across the server
        // we append .png top the filename so that files are recognised as their format
        let fileName = "images/uploads/" + "IMAGE-" + uniqueSuffix + ".png";
        // update the string attached to the incoming req.body.image field
        // this is added to the database as the imageLocation
        req.body.imageLocations += fileName + ",";
    },
});
// set up multer function to be called on uploads
let upload = multer({ storage: storage });

//#endregion IMAGES AND IMAGE UPLOAD HANDLING

// Session setup
var session = require("cookie-session");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
var userSession = {
    secret: "myMegaSecret",
    keys: ["key1", "key2", "key3"],
    originalMaxAge: 0,
    maxAge: 0,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 30,
    },
};

app.use(cookieParser());
app.use(session(userSession));

const GET_ALL_USERS_FRIENDS =
    "SELECT * FROM friendships WHERE user1 =? OR user2 = ?";

const setupRoutes = require("./routes/setup");
const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const accountRoutes = require("./routes/account");
const moduleRoutes = require("./routes/modules");
const friendRoutes = require("./routes/friends");
const profileRoutes = require("./routes/profile");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");
const postRoutes = require("./routes/posts");
const feedRoutes = require("./routes/feeds");

app.use("/setup", setupRoutes);
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/account", accountRoutes);
app.use("/modules", moduleRoutes);
app.use("/friends", friendRoutes);
app.use("/profile", profileRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);
app.use("/posts", postRoutes);
app.use("/feeds", feedRoutes);

app.listen(process.env.PORT);
console.log("server.js running on port " + process.env.PORT);
