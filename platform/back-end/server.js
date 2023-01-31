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

// default profile picture applied to all users profilePicture field in the users table of the db on account creation
let defaultProfilePicture = "images/defaultUser.png";

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

//#endregion SETUP

//#region SQL DATABASE SETUP AND QUERIES

const db = require("./config/database");

//#region SQL QUERIES

const GET_USERS_CHATS =
    "SELECT chats.*, `users`.`firstName`, `users`.`lastName`, `users`.`profilePicture` FROM chats LEFT OUTER JOIN `users` ON (`chats`.`user1` != ? AND `chats`.`user1` = `users`.`username`) OR (`chats`.`user2` != ? AND `chats`.`user2` = `users`.`username`) WHERE `user1` = ? OR `user2` = ? ORDER BY lastActive DESC";
const GET_MESSAGES_BY_CHAT_ID =
    "SELECT * FROM `messages` WHERE chatId = ? ORDER BY date DESC";
const GET_CHAT_DATA_BY_CHAT_ID =
    "SELECT chats.*, `users`.`firstName`, `users`.`lastName`, `users`.`profilePicture` FROM chats LEFT OUTER JOIN `users` ON (`chats`.`user1` != ? AND `chats`.`user1` = `users`.`username`) OR (`chats`.`user2` != ? AND `chats`.`user2` = `users`.`username`) WHERE chatId = ?";
const CHECK_THAT_USERS_ARE_FRIENDS =
    "SELECT * FROM friendships WHERE (user1 = ? OR user2 = ?) AND (user1 = ? OR user2 = ?)";
const GET_USER_GENERAL_INFO_BY_USERNAME =
    "SELECT firstName, lastName, aboutMe, location, education, work, profilePicture, coverPicture FROM users WHERE username = ?";
const GET_USER_PROFILE_INFO_BY_USERNAME =
    "SELECT firstName, lastName, aboutMe, profilePicture, coverPicture FROM users WHERE username = ?";
const GET_POST_VOTES_BY_POST_ID =
    "SELECT likes, dislikes FROM posts WHERE id = ?";
const UPDATE_POST_VOTES_BY_POST_ID =
    "UPDATE posts SET likes = ?, dislikes = ? WHERE id = ?";
const UPDATE_PASSWORD_BY_EMAIL =
    "UPDATE users SET password = ?, passwordSalt = ? WHERE email = ?";
const LOOK_UP_EMAIL_BY_EMAIL = "SELECT email FROM users WHERE email = ?";
const UPDATE_EMAIL = "UPDATE users SET email = ? WHERE email = ?";
const UPDATE_USER_GENERAL_INFO =
    "UPDATE users SET firstName = ?, lastName = ?, aboutMe = ?, location = ?, education = ?, work = ? WHERE username = ?";
const FIND_USER = "SELECT * FROM users WHERE email = ?";
const SIGN_UP_USER =
    "INSERT INTO users (email, username, firstName,lastName, password, passwordSalt, profilePicture) VALUES(?,?,?,?,?,?,?)";
const GET_ALL_POSTS = "SELECT * FROM `posts` ORDER BY id DESC";
const GET_ALL_POSTS_BY_CIRCLE =
    "SELECT * FROM `posts` WHERE circle = ? ORDER BY id DESC";
const GET_ALL_IMAGES_BY_USER =
    "SELECT * FROM images WHERE ownerUsername = ? ORDER BY postId DESC";
const GET_ALL_USERS_FRIENDS =
    "SELECT * FROM friendships WHERE user1 =? OR user2 = ?";
const GET_NOTIFICATIONS =
    "SELECT userActions.* , users.firstName, users.lastName FROM `userActions` LEFT OUTER JOIN `users` ON `userActions`.`sender` = `users`.`username` WHERE recipient = ? ORDER BY actionId DESC LIMIT 10";
const GET_POSTS_BY_AUTHOR_OR_RECIPIENT =
    "SELECT posts.*, users.firstName, users.lastName, users.profilePicture FROM `posts` LEFT OUTER JOIN `users` ON `posts`.`author` = `users`.`username` WHERE author = ? OR recipient = ? ORDER BY id DESC";
const GET_POSTS_BY_AUTHOR_BY_CIRCLE =
    "SELECT * FROM `posts` WHERE author = ? AND circle = ? ORDER BY id DESC";
const ADD_POST_TO_POSTS = "INSERT INTO `posts` SET ?, date = NOW()";
const GET_USERS_FOLLOWED_CIRCLES =
    "SELECT `users`.`circles` FROM `users` WHERE `users`.`username` = ?";

//#endregion SQL QUERIES

const setupRoutes = require("./routes/setup");
const authRoutes = require("./routes/auth");
const searchRoutes = require("./routes/search");
const accountRoutes = require("./routes/account");

app.use("/setup", setupRoutes);
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/account", accountRoutes);

//#endregion SQL DATABASE SETUP AND QUERIES

//#region ENDPOINTS

//#region GENERAL FUNCTIONALITY

//#endregion GENERAL FUNCTIONALITY

//#region FEED

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
//#endregion FEED

//#region GET USER INFO

app.post("/refreshData", (req, res) => {
    //set up variables from the request body
    let user = req.body.loggedInUsername;
    // grab userData from the users table where the user name matches the logged in users
    db.query(
        "SELECT firstName, lastName, profilePicture FROM users WHERE username = ?",
        user,
        (err, userData) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // respond with user data on success
            res.json(userData[0]);
        }
    );
});

app.post("/getAllCircles", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    db.query("SELECT * FROM circles", (err, circles) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        db.query(GET_USERS_FOLLOWED_CIRCLES, user, (err, followedCircles) => {
            // turn the returned string of circles into an array
            let currentCircles = [];
            [0];
            if (
                followedCircles[0] !== undefined &&
                followedCircles[0] !== null
            ) {
                if (
                    followedCircles[0].circles !== undefined &&
                    followedCircles[0].circles !== null
                ) {
                    currentCircles = followedCircles[0].circles.split(",");
                }
            }
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            //respond with circles on success
            res.json({
                circles: circles,
                followedCircles: currentCircles,
            });
        });
    });
});

app.post("/addCircle", (req, res) => {
    //set up variables from the request body
    let { user, circleName } = req.body;
    db.query(GET_USERS_FOLLOWED_CIRCLES, user, (err, circles) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }

        // turn the returned string of circles into an array
        let currentCircles = [];
        if (circles[0] !== undefined && circles[0] !== null) {
            if (
                circles[0].circles !== undefined &&
                circles[0].circles !== null
            ) {
                currentCircles = circles[0].circles.split(",");
            }
        }

        // add the circle from the request to the array
        currentCircles.push(circleName);

        // ready a new string format list
        let newCirclesList = "";
        // add each element of the array to the string, seperated by a comma
        currentCircles.forEach((circle) =>
            circle.length > 2 && newCirclesList.indexOf(circle) === -1
                ? (newCirclesList += circle + ",")
                : ""
        );
        // update the circles column in the users table where the username matches the request
        db.query(
            "UPDATE users SET circles = ? WHERE username = ?",
            [newCirclesList, user],
            (err) => {
                // if error
                if (err) {
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                //respond with circles on success
                res.json("success");
            }
        );
    });
});

app.post("/deleteCircle", (req, res) => {
    //set up variables from the request body
    let { user, circleName } = req.body;
    db.query(GET_USERS_FOLLOWED_CIRCLES, user, (err, circles) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }

        // turn the returned string of circles into an array
        let currentCircles = [];
        if (circles[0] !== undefined && circles[0] !== null) {
            if (
                circles[0].circles !== undefined &&
                circles[0].circles !== null
            ) {
                currentCircles = circles[0].circles.split(",");
            }
        }
        // turn the returned string of circles into an array

        // add the circle from the request to the array
        // ready a new string format list
        let newCirclesList = "";
        // add each element of the array to the string, seperated by a comma
        currentCircles.forEach((circle) =>
            circle.length > 2 &&
            circle !== circleName &&
            newCirclesList.indexOf(circle) === -1
                ? (newCirclesList += circle + ",")
                : ""
        );
        // update the circles column in the users table where the username matches the request

        db.query(
            "UPDATE users SET circles = ? WHERE username = ?",
            [newCirclesList, user],
            (err) => {
                // if error
                if (err) {
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                //respond with circles on success
                res.json("success");
            }
        );
    });
});

app.post("/getUsersCircles", (req, res) => {
    let user = req.body.user;
    db.query(GET_USERS_FOLLOWED_CIRCLES, user, (err, circles) => {
        // turn the returned string of circles into an array

        let currentCircles = [];
        if (circles[0] !== undefined && circles[0] !== null) {
            if (
                circles[0].circles !== undefined &&
                circles[0].circles !== null
            ) {
                currentCircles = circles[0].circles.split(",");
            }
        }

        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        //respond with circles on success
        res.json(currentCircles);
    });
});

app.post("/getFriends", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    // ready friends array to populate
    let friendsList = [];
    // add the logged in user to the friends array so we also get the user
    friendsList[0] = "'" + user + "'";
    // get all entries from the friendships table that contain the logged in users username
    db.query(GET_ALL_USERS_FRIENDS, [user, user], (err, friendships) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }

        if (friendships !== null && friendships.length > 0) {
            // iterate through each returned friendship, and add the username **that is not** the logged in users username to the friend list above
            friendships.forEach((friendship) =>
                friendship.user1 === user
                    ? friendsList.push("'" + friendship.user2 + "'")
                    : friendsList.push("'" + friendship.user1 + "'")
            );
        }
        // get first name, last name and profile picture of all users that appear in the new friendsList array
        db.query(
            "SELECT firstName, lastName, profilePicture, username FROM users WHERE username IN  (" +
                friendsList.join(",") +
                ")",
            (err, FriendData) => {
                // if error
                if (err) {
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                // respond with friend data on success
                res.json(FriendData);
            }
        );
    });
});

app.post("/getAllFriends", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    // get any friendships from friendships that contain the logged in users username
    db.query(GET_ALL_USERS_FRIENDS, user, user, (err, friendships) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // set up an empty friends list to populate
        let friends = [];

        // add each name to the friends list from the friends list that is not the logged in users name
        friendships.forEach((element) =>
            element.user1 === user
                ? friends.push(element.user2)
                : friends.push(element.user1)
        );
        // respond with a sorted version of the friends list
        res.json(friends.sort());
    });
});

app.post("/deleteFriend", (req, res) => {
    let { user, friend } = req.body;
    // delete the friendship containing both users' names from the friendships table
    db.query(
        "DELETE FROM friendships WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)",
        [user, friend, friend, user],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // respond with success
            res.json("success");
        }
    );
});

app.post("/getNotifications", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    // get the 50 latest entries and sender user data from userActions where recipient is the logged in user
    db.query(GET_NOTIFICATIONS, user, (err, notifications) => {
        // if error
        if (err) {
            console.log(err);
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        let unseenNotifications = [];
        notifications.forEach((notification) =>
            !notification.seen ? unseenNotifications.push(notification) : ""
        );
        // get all chats where user and matching 'seen by user' is the logged in user and false, so we only get unseen message notifications
        db.query(
            "SELECT * FROM chats WHERE `user1` = ? AND `seenByuser1` = false OR `user2` = ? AND `seenByUser2` = false",
            [user, user],
            (err, messages) => {
                // if error
                if (err) {
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                // respond with notifications and messages on success
                res.json({
                    unseenNotifications: unseenNotifications,
                    notifications: notifications,
                    messages: messages,
                });
            }
        );
    });
});

app.post("/clearSingleNotification", (req, res) => {
    //set up variables from the request body
    let actionId = req.body.actionId;
    db.query("DELETE FROM userActions WHERE actionId = ?", actionId, (err) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with success
        res.json("success");
    });
});

//#endregion GET USER INFO

//#region PROFILE DATA

app.post("/getUserProfile", (req, res) => {
    //set up variables from the request body
    let { loggedInUsername, userProfileToGet } = req.body;
    // check the database for any existing friendships containing both the logged in user and the profile in question
    db.query(
        "SELECT * FROM friendships WHERE (user1 = ? OR user2 = ?) AND (user1 = ? OR user2 = ?)",
        [
            loggedInUsername,
            loggedInUsername,
            userProfileToGet,
            userProfileToGet,
        ],
        (err, friendships) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // not friends by default
            let isFriendsWithLoggedInUser = false;
            // if a friendship was returned, or the profile in question is the users profile, set is friends to true to reveal the profile
            // otherwise prevent userData from showing
            friendships.length > 0 || loggedInUsername === userProfileToGet
                ? (isFriendsWithLoggedInUser = true)
                : (isFriendsWithLoggedInUser = false);
            // get the user data matching the profile in question by username
            db.query(
                GET_USER_PROFILE_INFO_BY_USERNAME,
                userProfileToGet,
                (err, userData) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        res.status(500).send(err.message);
                        return;
                    }
                    // respond with friendship status and userData
                    res.json({
                        isFriendsWithLoggedInUser: isFriendsWithLoggedInUser,
                        profileData: userData[0],
                    });
                }
            );
        }
    );
});

app.post("/getAllImagesByUser", (req, res, next) => {
    //set up variables from the request body
    let user = req.body.user;
    // get all images from the images table where the owner username matches user in the request
    db.query(GET_ALL_IMAGES_BY_USER, user, (err, images) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with images on success
        res.json(images);
    });
});

app.post("/getFeedByUser", (req, res) => {
    //set up variables from the request body
    let { loggedInUsername, userProfileToGet, circle } = req.body;
    // set is friends with the logged in user to false by default
    let isFriendsWithLoggedInUser = false;
    // check the friendships table in the database for a friendShip that contains both the users
    db.query(
        CHECK_THAT_USERS_ARE_FRIENDS,
        [
            loggedInUsername,
            loggedInUsername,
            userProfileToGet,
            userProfileToGet,
        ],
        (err, friendships) => {
            if (err) {
                console.log("error at database with friendships");
                res.json("error at database with friendships");
                return;
            }
            // if a friendship is returned, or or the profile in question is the logged in users profile, set is friends with to true, otherwise false
            friendships.length > 0 || loggedInUsername === userProfileToGet
                ? (isFriendsWithLoggedInUser = true)
                : (isFriendsWithLoggedInUser = false);
            // selected feed circle is 'general
            if (circle === "general") {
                // get post and user data from entries in the posts table, where the author or recipient of the post (for people posting on their wall) is
                // the user in question
                db.query(
                    GET_POSTS_BY_AUTHOR_OR_RECIPIENT,
                    [userProfileToGet, userProfileToGet],
                    (err, posts) => {
                        // if error
                        if (err) {
                            // respond with error status and error message
                            console.log("error at database", err);
                            res.status(500).send(err.message);
                            return;
                        }
                        // set up an empty list ready for postIds
                        let postIds = [];
                        // push each returned post id the empty list and get any corresponding images realting to that post id
                        posts.forEach((post) => {
                            postIds.push(post.id);
                            // create empty post images list
                            post.images = [];
                        });
                        // get image data where relative post matches the current iteration of post ids
                        db.query(
                            "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (" +
                                postIds.join(",") +
                                ")",
                            (err, images) => {
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
                                // respond with friendship status and posts
                                res.json({
                                    isFriendsWithLoggedInUser:
                                        isFriendsWithLoggedInUser,
                                    posts: posts,
                                });
                            }
                        );
                    }
                );
            } else {
                // otherwise get posts by specific circle
                db.query(
                    GET_POSTS_BY_AUTHOR_BY_CIRCLE,
                    [userProfileToGet, userProfileToGet],
                    (err, posts) => {
                        // if error
                        if (err) {
                            // respond with error status and error message
                            console.log("error at database");
                            res.status(500).send(err.message);
                            return;
                        }
                        // create empty posts list
                        let postIds = [];
                        // push each returned post id the empty list and get any corresponding images realting to that post id
                        posts.forEach((post) => {
                            postIds.push(post.id);
                            // create empty images list
                            post.images = [];
                        });
                        // get image data where relative post matches the current iteration of post ids
                        db.query(
                            "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (" +
                                postIds.join(",") +
                                ")",
                            (err, images) => {
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

                                res.json({
                                    // respond with friendship status and posts
                                    isFriendsWithLoggedInUser:
                                        isFriendsWithLoggedInUser,
                                    posts: posts,
                                });
                            }
                        );
                    }
                );
            }
        }
    );
});

//#endregion PROFILE DATA

//#region MESSAGING

app.post("/newMessage", (req, res) => {
    //set up variables from the request body
    let { chatId, sender, message, recipient, user1, user2 } = req.body;

    // add a message to the database with the chatId, sender message and recipient
    db.query(
        "INSERT INTO messages (chatId, sender, message, recipient, date, seen) VALUES (?, ?, ?, ?, NOW(), ?)",
        [chatId, sender, message, recipient, false],
        (err, rows) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            if (sender === user1) {
                db.query(
                    "UPDATE chats SET seenByUser2 = ? WHERE chatId = ?",
                    [false, chatId],
                    (err) => {
                        // if error
                        if (err) {
                            // respond with error status and error message
                            res.status(500).send(err.message);
                            return;
                        }
                        //respond with success on success
                        res.json("success");
                    }
                );
            } else if (sender === user2) {
                db.query(
                    "UPDATE chats SET seenByUser1 = ? WHERE chatId = ?",
                    [false, chatId],
                    (err) => {
                        // if error
                        if (err) {
                            // respond with error status and error message
                            res.status(500).send(err.message);
                            return;
                        }
                        //respond with success on success
                        res.json("success");
                    }
                );
            }
        }
    );
});

app.post("/getAllUsersChats", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    /* select all chat data and *the user in the chats*
   first name, last name and profile picture from all
   chats in the chats table where user1 or user2 matches
   the logged in users username, order results by the
    date in descending order*/
    db.query(GET_USERS_CHATS, [user, user, user, user], (err, chatData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        res.json(chatData);
    });
});

app.post("/getChat", async (req, res) => {
    //set up variables from the request body
    let { user, chatId, partner } = req.body;
    if (chatId === false || chatId === undefined) {
        await db.query(
            "SELECT chatId FROM chats WHERE ((user1 = ? OR user2 = ?) AND (user1 = ? OR user2 = ?))",
            [req.body.user, req.body.user, req.body.partner, req.body.partner],
            async function (err, result) {
                // if error
                if (err) {
                    console.log(err);
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                if (result[0] === undefined) {
                    // create a chat passing in logged in users username as sender, recipient, and message
                    await db.query(
                        "INSERT INTO chats SET ?, lastActive = NOW()",
                        {
                            user1: user,
                            user2: partner,
                            seenByUser1: true,
                            seenByUser2: false,
                        },
                        async function (err, results) {
                            // if error
                            if (err) {
                                console.log(err);
                                // respond with error status and error message
                                res.status(500).send(err.message);
                                return;
                            }
                            // set chatId to the id of the data just added
                            chatId = results.insertId;
                        }
                    );
                } else {
                    chatId = result[0].chatId;
                }
                if (chatId) {
                    db.query(
                        GET_CHAT_DATA_BY_CHAT_ID,
                        [user, user, chatId],
                        (err, chatData) => {
                            // if error
                            if (err) {
                                console.log(err);
                                // respond with error status and error message
                                res.status(500).send(err.message);
                                return;
                            }
                            // pull all messages from the messages table in the database by chatId above, ordered by date
                            db.query(
                                GET_MESSAGES_BY_CHAT_ID,
                                [chatId],
                                (err, messages) => {
                                    // if error
                                    if (err) {
                                        console.log(err);
                                        // respond with error status and error message
                                        res.status(500).send(err.message);
                                        return;
                                    }
                                    // respond with chat data and messages on success
                                    res.json({
                                        chatData: chatData[0],
                                        messages: messages,
                                    });
                                }
                            );
                        }
                    );
                }
            }
        );
    } else {
        db.query(
            GET_CHAT_DATA_BY_CHAT_ID,
            [user, user, chatId],
            (err, chatData) => {
                // if error
                if (err) {
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                // pull all messages from the messages table in the database by chatId above, ordered by date
                db.query(GET_MESSAGES_BY_CHAT_ID, [chatId], (err, messages) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        res.status(500).send(err.message);
                        return;
                    }
                    // respond with chat data and messages on success
                    res.json({
                        chatData: chatData[0],
                        messages: messages,
                    });
                });
            }
        );
    }
});

app.post("/setChatAsSeen", (req, res) => {
    //set up variables from the request body
    let { chatId, user1, user2, user } = req.body;
    let userToUpdate = "";
    if (user1 === user) {
        userToUpdate = "seenByUser1";
    } else if (user2 === user) {
        userToUpdate = "seenByUser2";
    }
    db.query(
        `UPDATE chats SET ${userToUpdate} = ? WHERE chatId = ?`,
        [true, chatId],
        (err) => {
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // respond with success message on completion
            res.json("success");
        }
    );
});

//#endregion MESSAGING

//#region USER ACTIONS AND NOTIFICATIONS

app.post("/setNotificationAsSeen", (req, res) => {
    //set up variables from the request body
    let { actionId } = req.body;
    // set the userAction as seen in the userActions table found by actionId from the request
    db.query(
        "UPDATE userActions SET seen = true WHERE actionId = ?",
        actionId,
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // respond with success message on completion
            res.json("success");
        }
    );
});

app.post("/newPost", upload.array("imagesArray", 4), (req, res) => {
    // MULTER HAS RUN FIRST..
    //set up variables from the request body
    let {
        imageLocations,
        recipient,
        username,
        postContent,
        postStrict,
        circle,
    } = req.body;
    // if there are images in the request
    if (imageLocations) {
        // if multiple images have been uploaded,
        // multer will have added multiple strings to req.body.imageLocations seperated by ','s,
        // we seperate the strings here to pass to the db for location storage
        images = req.body.imageLocations.split(",");
        // the first always has undefined attached to it, so we replace it with nothing to delete it
        images[0] = images[0].replace("undefined", "");
    }
    let strictSwitch = 0;
    console.log(postStrict);
    // OLD STYLE FUNCTION AT THE END FOR this.lastID SUPPORT (not supported by ES6 yet)
    // add post to posts table with corresponding username, circle, content, recipient, 0 likes, 0 dislikes, and strict status
    if (postStrict === false) {
        strictSwitch = 0;
    } else {
        strictSwitch = 1;
    }
    db.query(
        ADD_POST_TO_POSTS,
        {
            author: username,
            circle: circle,
            content: postContent,
            recipient: recipient,
            likes: 0,
            dislikes: 0,
            postStrict: strictSwitch,
        },
        function (err, results) {
            // if error
            if (err) {
                console.log(err);
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // set post Id to the id from the post just created
            let postId = results.insertId;
            // if image locations in the request are defined
            if (req.body.imageLocations !== undefined) {
                // loop through each image, if the image name is greater than 0 characters (if it has a value)..
                images.forEach((image) =>
                    image.length > 0
                        ? // insert the image into the images table with the logged in user as the owner, image name as location and the post ID
                          //returned above as the relative post
                          db.query(
                              "INSERT INTO images (ownerUsername, imageLocation, postId) VALUES (?,?,?)",
                              [username, image, postId],
                              (err) => {
                                  // if error
                                  if (err) {
                                      // respond with error status and error message
                                      res.status(500).send(err.message);
                                      return;
                                  }
                              }
                          )
                        : // otherwise do nothing (if images has no value)
                          ""
                );
                // response for success after posting and uploading images
                res.json({ data: "success" });
            } else {
                // response for success after posting without images
                res.json({ data: "success" });
            }
        }
    );
});

app.post("/votePost", (req, res) => {
    //set up variables from the request body
    let { like, dislike, postId, sender, recipient } = req.body;
    // message attached to the notification added to userActions
    let message = " reacted to your post!";
    // put an entry into the userActions table with the information pulled out of the request above
    db.query(
        "INSERT INTO userActions (type, sender, recipient, message, seen, approved, date, relativePost) VALUES (?,?,?,?,?,?, NOW(),?)",
        ["reaction", sender, recipient, message, false, false, postId],
        (err) => {
            // if error
            if (err) {
                console.log(err);
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
        }
    );
    // update the likes or dislikes on the post reacted to
    db.query(UPDATE_POST_VOTES_BY_POST_ID, [like, dislike, postId], (err) => {
        // if error
        if (err) {
            console.log(err);
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with success message on success
        res.json("success applying like to post at database");
    });
});

app.post("/clearNotifications", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    db.query(
        "DELETE FROM userActions WHERE recipient = ? AND seen = ?",
        [user, true],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                console.log(err);
                res.status(500).send(err.message);

                return;
            }
            // respond with success message on success
            res.json("success");
        }
    );
});

app.post("/friendRequest", (req, res) => {
    //set up variables from the request body
    let { sender, recipient } = req.body;
    // ready type for userActions entry
    let type = "friendRequest";
    // ready message for notifcation
    let message = " wants to be your friend!";
    // set seen as false so recipient gets notified
    let seen = false;
    // no relative post for friend request
    let relativePost = null;
    // check that a friend request doesnt already exist in the database
    db.query(
        "SELECT * FROM userActions WHERE type = ? AND sender = ?",
        [type, sender],
        (err, rows) => {
            if (err) {
                res.json(err);
                return;
            }
            // if nothing is found..
            if (!rows || rows.length < 1) {
                // insert a new user action into the database witht he above readied data
                db.query(
                    "INSERT INTO userActions set ?,date = NOW()",
                    {
                        type: type,
                        sender: sender,
                        recipient: recipient,
                        message: message,
                        seen: seen,
                        approved: false,
                        relativePost: relativePost,
                    },
                    (err, rows) => {
                        if (err) {
                            res.status(500).send(err.message);
                            return;
                        }
                        // respond with success message on success
                        res.json("request sent");
                    }
                );
                // otherwise..
            } else {
                // retract existing friend request and delete from database
                db.query(
                    "DELETE FROM userActions WHERE type = ? AND sender = ?",
                    [type, sender],
                    (err, rows) => {
                        if (err) {
                            res.json(err);
                            return;
                        }
                        // respond with request deleted on success
                        res.json("request deleted");
                    }
                );
            }
        }
    );
});

app.post("/confirmFriendRequest", (req, res) => {
    //set up variables from the request body
    let { sender, recipient } = req.body;
    // set up type for finding in userActions
    let type = "friendRequest";
    // delete the existing friend request that contains the sender, recipient (the logged in user) and type friend request
    db.query(
        "DELETE FROM userActions WHERE sender = ? AND recipient = ? AND type = ?",
        [sender, recipient, type],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // create a new entry into friendships containing the logged in user and the sender
            db.query(
                "INSERT INTO friendships (user1, user2) VALUES (?,?)",
                [sender, recipient],
                (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        res.status(500).send(err.message);
                        return;
                    }
                    //respond with success on completion
                    res.json("success");
                }
            );
        }
    );
});

app.post("/refuseFriendRequest", (req, res) => {
    //set up variables from the request body
    let { sender, recipient } = req.body;
    // set up type to find request in db
    let type = "friendRequest";
    // delete the corresponding friend request from the db where sender, recipient and type match
    db.query(
        "DELETE FROM userActions WHERE sender = ? AND recipient = ? AND type = ?",
        [sender, recipient, type],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // respond with success on success
            res.json("success");
        }
    );
});

//#endregion USER ACTIONS AND NOTIFICATIONS

//#endregion ENDPOINTS

app.listen(process.env.PORT);
console.log("server.js running on port " + process.env.PORT);
