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

app.post("/getFeedFriendsOnly", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    // ready friends array to populate
    let friendsList = [];
    // add the logged in user to the friends array so we also get posts from the user
    friendsList[0] = "'" + user + "'";
    // get all entries from the friendships table that contain the logged in users username
    db.query(GET_ALL_USERS_FRIENDS, [user, user], (err, friendships) => {
        // if error
        if (err) {
            console.log(err);
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // for each loop doesnt work with mySQL, added a forLoop that does the same thing
        // iterate through each returned friendship, and add the username **that is not** the logged in users username to the friend list above
        for (let i = 0; i < friendships.length; i++) {
            if (friendships[i].user1 === user) {
                friendsList.push("'" + friendships[i].user2 + "'");
            } else {
                friendsList.push("'" + friendships[i].user1 + "'");
            }
        }
        // friendships.forEach(friendship => friendship.user1 === user ? friendsList.push("'" + friendship.user2 + "'") : friendsList.push("'" + friendship.user1 + "'"));
        // if selected circle is general
        if (req.body.circle === "general") {
            // select all posts and posters firstname, lastname and profile picture where the author of the posts username exists in the above friend list
            db.query(
                "SELECT posts.*, users.firstName, users.lastName, users.profilePicture FROM `posts` LEFT OUTER JOIN `users` ON `posts`.`author` = `users`.`username` WHERE author IN  (" +
                    friendsList.join(",") +
                    ") AND (((postStrict = false OR postStrict = 'false') OR circle = 'general') AND recipient = ?) ORDER BY id DESC",
                "none",
                (err, posts) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        res.status(500).send(err.message);
                        return;
                    }
                    // ready an empty list to populate with postId's
                    let postIds = [];
                    // iterate through each of the returned posts
                    if (posts !== undefined) {
                        posts.forEach((post) => {
                            // add the current iterations postId to the postIds list
                            postIds.push(post.id);
                            // ready and empty image list to populate with any/all images relating to this post
                            post.images = [];
                        });
                    }
                    if (posts === undefined) {
                        posts = "none";
                    }
                    if (postIds.length === 0) {
                        res.json({
                            posts: posts,
                        });
                        return;
                    } else {
                        // get all images from the database from the images table relating to any of the postId's in the above list
                        db.query(
                            "SELECT * FROM images WHERE postId IN  (" +
                                postIds.join(",") +
                                ")",
                            (err, images) => {
                                if (images !== undefined) {
                                    for (let i = 0; i < images.length; i++) {
                                        posts.forEach((post) => {
                                            images[i].postId === post.id
                                                ? post.images.push(
                                                      images[i].imageLocation
                                                  )
                                                : "";
                                        });
                                    }
                                }
                                // for each image in the images list, loop through the posts and add the image to the post if postId and relativePostId's match
                                // images.forEach(image => posts.forEach(post=> {image.postId === post.id ? post.images.push(image.imageLocation): '' }));
                                // if error
                                if (err) {
                                    // respond with error status and error message
                                    console.log(err);
                                    res.status(500).send(err.message);
                                    return;
                                }

                                //respond with posts on success
                                res.json({
                                    posts: posts,
                                });
                            }
                        );
                    }
                }
            );
        } else {
            // select all posts and posters firstname, lastname and profile picture
            // where the author of the posts username exists in the above friend list
            // but only if the posts circle matches the circle coming in from the request
            db.query(
                "SELECT posts.*, users.firstName, users.lastName, users.profilePicture FROM `posts` LEFT OUTER JOIN `users` ON `posts`.`author` = `users`.`username` WHERE circle = ? AND author IN (" +
                    friendsList.join(",") +
                    ") ORDER BY id DESC",
                req.body.circle,
                (err, posts) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        res.status(500).send(err.message);
                        return;
                    }
                    // ready an empty list to populate with postId's
                    let postIds = [];
                    // iterate through each of the returned posts
                    posts.forEach((post) => {
                        // add the current iterations postId to the postIds list
                        postIds.push(post.id);
                        // ready and empty image list to populate with any/all images relating to this post
                        post.images = [];
                    });
                    if (postIds.length > 0) {
                        // get all images from the database from the images table relating to any of the postId's in the above list
                        db.query(
                            "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (" +
                                postIds.join(",") +
                                ")",
                            (err, images) => {
                                // for each image in the images list, loop through the posts and add the image to the post if postId and relativePostId's match
                                if (images !== undefined) {
                                    images.forEach((image) =>
                                        posts.forEach((post) => {
                                            image.postId === post.id
                                                ? post.images.push(
                                                      image.imageLocation
                                                  )
                                                : "";
                                        })
                                    );
                                }

                                // if error
                                if (err) {
                                    console.log(err);
                                    // respond with error status and error message
                                    res.status(500).send(err.message);
                                    return;
                                }
                                //respond with posts on success
                                res.json({
                                    posts: posts,
                                });
                            }
                        );
                    } else {
                        res.json({
                            posts: posts,
                        });
                    }
                }
            );
        }
    });
});

app.listen(process.env.PORT);
console.log("server.js running on port " + process.env.PORT);
