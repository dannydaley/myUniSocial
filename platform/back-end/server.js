//#region SETUP
var express = require("express");
var app = express();
app.use(express.json());
const https = require("https");
const http = require("http");
const socket = require("./socket");
const server = https.createServer(app);
// const server = http.createServer(app);

const cors = require("cors");
// set up cors to allow for different cross origin requests and prevent security errors.
app.use(
    cors({
        origin: [
            // remove the * wildcard when done testing
            "*",
            process.env.FRONTEND,
            "http://192.168.168.6:3000",
            "http://localhost:3000",
            "http://dd252935.kemeneth.net:9030",
            "http://myunisocial.kemeneth.net",
            "http://127.0.0.1:9030",
            "https://dd252935.kemeneth.net:9030",
            "https://myunisocial.kemeneth.net",
        ],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

var dotenv = require("dotenv").config();

var bodyParser = require("body-parser");
var fallback = require("express-history-api-fallback");

app.use(bodyParser.json());
var path = require("path");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "build")));
const root = path.join(__dirname, "build");
app.use(fallback("index.html", { root: root }));
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
//import session file
const session = require("./session");
app.use(session);

const GET_ALL_USERS_FRIENDS =
    "SELECT * FROM friendships WHERE user1 =? OR user2 = ?";

//import different route files
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

//apply route files to app()
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

app.get("*", function (req, res) {
    res.redirect("https://" + req.headers.host + req.url);

    // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
    // res.redirect('https://example.com' + req.url);
});

//set server to listen to port from .env
server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    //Adds socket listener
    socket(server);
});
