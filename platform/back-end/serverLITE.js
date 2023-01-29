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

//#region SECURITY
// set up crypto middleware for hashing password and checking password hahses
let crypto = require("crypto");

// number of iterations to jumble the hash
const iterations = 1000;

//set up char length of hash
const hashSize = 64;

// which hashing algorithm will be used
const hashAlgorithm = "sha256";

// create a hash salt/pepper
const generatePepper = crypto.randomBytes(256).toString("hex");

//this function returns a hash of the password, combined with the pepper and the salt.
function passwordHash(thePassword, theSalt) {
    const pepper = process.env.PEPPER;
    return crypto
        .pbkdf2Sync(
            thePassword,
            pepper + theSalt,
            iterations,
            hashSize,
            hashAlgorithm
        )
        .toString("hex");
}

//#endregion SECURITY

//#endregion SETUP

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

//#region SQL DATABASE SETUP AND QUERIES

// SQLite 3 setup for test db while in development
var sqlite3 = require("sqlite3").verbose();

// set up variable for access to database
let SQLdatabase = new sqlite3.Database("./database/SQLdatabase.db");

// set app.locals database to the initialised variable
app.locals.SQLdatabase = SQLdatabase;

//JSON files for dummy data on table builds
let postDataJSON = require("./database/posts.json");
let userDataJSON = require("./database/users.json");
let imagesDataJSON = require("./database/images.json");
let friendshipsDataJSON = require("./database/friendships.json");
let userActionsDataJSON = require("./database/userActions.json");
let chatsDataJSON = require("./database/chats.json");
let messagesDataJSON = require("./database/messages.json");
let circlesDataJSON = require("./database/circles.json");

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
const ADD_POST_TO_POSTS =
    "INSERT INTO `posts` (author, circle, content, date, recipient, likes, dislikes, postStrict) VALUES(?,?,?,date(),?,?,?,?)";
const GET_ALL_USERS = "SELECT * FROM users";
const GET_USERS_FOLLOWED_CIRCLES =
    "SELECT `users`.`circles` FROM `users` WHERE `users`.`username` = ?";

//#endregion SQL QUERIES

//#region SQL SETUP ENDPOINTS

// users table setup endpoint
app.get("/usersSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        //delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `users`");
        //recreate the users table
        SQLdatabase.run(
            "CREATE TABLE `users` (id INTEGER PRIMARY KEY AUTOINCREMENT, username varchar(255) UNIQUE, firstName varchar(255), lastName varchar(255), email varchar(255) UNIQUE, password varchar(255), passwordSalt varchar(512), aboutMe text, location varchar(255), education varchar(255), work varchar(255), profilePicture varchar(255), coverPicture varchar(255), circles text)"
        );
        //create array of users from the dummy data JSON file
        let users = userDataJSON.users;
        // insert each element in the array of objects into the users table in the database
        users.forEach((user) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `users` (username, firstName, lastName, email, password, passwordSalt, aboutMe, location, education, work, profilePicture, coverPicture, circles) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?)",
                // values passed in from current iteration of the users array
                [
                    user.username,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.password,
                    user.passwordSalt,
                    user.aboutMe,
                    user.location,
                    user.education,
                    user.work,
                    user.profilePicture,
                    user.coverPicture,
                    user.circles,
                ]
            );
        });
    });
    // respond with success page
    console.log("users table set up");
    res.send("user-db-done");
});

// posts table setup endpoint
app.get("/postsSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        // delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `posts`");
        // recreate the posts table
        SQLdatabase.run(
            "CREATE TABLE `posts` ( id INTEGER PRIMARY KEY AUTOINCREMENT, author varchar(255), content text,  date varchar(255), circle varchar(255), recipient varchar(255), likes int, dislikes int, postStrict int)"
        );
        //create array of post objects from the dummy data JSON file
        let posts = postDataJSON.entries;
        // insert each element in the array of objects into the posts table in the database
        posts.forEach((post) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `posts` (id, author, content, date, circle, recipient, likes, dislikes, postStrict) VALUES(?,?,?,?,?,?,?,?,?)",
                // values passed in from current iteration of the posts array
                [
                    post.id,
                    post.author,
                    post.content,
                    post.date,
                    post.circle,
                    post.recipient,
                    post.likes,
                    post.dislikes,
                    post.postStrict,
                ]
            );
        });
    });
    // respond with success page
    console.log("posts table set up");
    res.send("posts-db-done");
});

// images table setup endpoint
app.get("/imagesSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        // delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `images`");
        // recreate images table
        SQLdatabase.run(
            "CREATE TABLE `images` ( ownerUsername varchar(255), imageLocation varchar(255), postId int)"
        );
        //create array of image objects from the dummy data JSON file
        let images = imagesDataJSON.images;
        // insert each element in the array of objects into the images table in the database
        images.forEach((image) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `images` (ownerUsername, imageLocation, postId) VALUES(?,?,?)",
                // values passed in from current iteration of the images array
                [image.ownerUsername, image.imageLocation, image.postId]
            );
        });
    });
    // respond success page
    console.log("images table set up");
    res.send("image-db-done");
});

// friendships table setup endpoint
app.get("/friendshipsSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        //delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `friendships`");
        // recreate friendships table
        SQLdatabase.run(
            "CREATE TABLE `friendships` ( user1 varchar(255), user2 varchar(255))"
        );
        //create array of friendship objects from the dummy data JSON file
        let friendships = friendshipsDataJSON.friendships;
        // insert each element in the array of objects into the friendships table in the database
        friendships.forEach((friendship) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `friendships` (user1, user2) VALUES(?,?)",
                // values passed in from current iteration of the friendships array
                [friendship.user1, friendship.user2]
            );
        });
    });
    // respond with success page
    console.log("friendships table set up");
    res.send("friendships-db-done");
});

app.get("/userActionsSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        //delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `userActions`");
        // recreate userActions table
        SQLdatabase.run(
            "CREATE TABLE `userActions` ( actionId INTEGER PRIMARY KEY AUTOINCREMENT, type varchar(255), sender varchar(255), recipient varchar(255), message varchar(255), seen int, approved int, date varchar(255), relativePost int)"
        );
        //create array of userActions from the dummy data JSON file
        let rows = userActionsDataJSON.userActions;
        // insert each element in the array of object into the userActions table in the database
        rows.forEach((row) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `userActions` (actionId, type, sender, recipient, message, seen, approved, date, relativePost) VALUES (?,?,?,?,?,?,?,?,?)",
                // values passed in from current iteration of the userActions array
                [
                    row.id,
                    row.type,
                    row.sender,
                    row.recipient,
                    row.message,
                    row.seen,
                    row.approved,
                    row.date,
                    row.relativePost,
                ]
            );
        });
    });
    // respond with success page
    console.log("userActions table set up");
    res.send("userActions-db-done");
});

app.get("/chatsSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        // delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `chats`");
        // recreate chats table
        SQLdatabase.run(
            "CREATE TABLE `chats` ( chatId INTEGER PRIMARY KEY AUTOINCREMENT, user1 varchar(255), user2 varchar(255), seenByUser1 int, seenByUser2 int, lastActive varchar(255))"
        );
        //create array of chats from the dummy data JSON file
        let chats = chatsDataJSON.chats;
        // insert each element in the array of objects into the chats table in the database
        chats.forEach((chat) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `chats` (chatId, user1, user2, seenByUser1, seenByUser2, lastActive) VALUES(?,?,?,?,?, datetime())",
                // values passed in from current iteration of the chats array
                [
                    chat.chatId,
                    chat.user1,
                    chat.user2,
                    chat.seenByUser1,
                    chat.seenByUser2,
                ]
            );
        });
    });
    // respond with succes page
    console.log("chats table set up");
    res.send("chats-db-done");
});

app.get("/messagesSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        //delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `messages`");
        // recreate messages table
        SQLdatabase.run(
            "CREATE TABLE `messages` ( chatId INTEGER, messageId INTEGER PRIMARY KEY AUTOINCREMENT, sender varchar(255), recipient varchar(255), message text, date varchar(255), seen int)"
        );
        //create array of messages from the dummy data JSON file
        let messages = messagesDataJSON.messages;
        // insert each element in the array of objects into the messages table in the database
        messages.forEach((message) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `messages` (chatId, messageId, sender, recipient, message, date, seen) VALUES(?,?,?,?,?,datetime(),?)",
                // values passed in from current iteration of the messages array
                [
                    message.chatId,
                    message.messageId,
                    message.sender,
                    message.recipient,
                    message.message,
                    message.seen,
                ]
            );
        });
    });
    // respond with success page
    console.log("messages table built");
    res.send("messages-db-done");
});

// circles table setup endpoint
app.get("/circlesSetup", (req, res, next) => {
    SQLdatabase.serialize(() => {
        //delete the table if it exists..
        SQLdatabase.run("DROP TABLE IF EXISTS `circles`");
        // recreate circles table
        SQLdatabase.run(
            "CREATE TABLE `circles` ( circleName varchar(255), users INT)"
        );
        //create array of circle objects from the dummy data JSON file
        let circles = circlesDataJSON.circles;
        // insert each element in the array of objects into the circle table in the database
        circles.forEach((circle) => {
            // SQL query to run
            SQLdatabase.run(
                "INSERT INTO `circles` (circleName, users) VALUES(?,?)",
                // values passed in from current iteration of the circles array
                [circle.circleName, circle.users]
            );
        });
    });
    // respond with success page
    console.log("circles table set up");
    res.send("circles-db-done");
});

//#endregion SQL SETUP ENDPOINTS

//#region DATABASE TEST ENDPOINTS

// get all users
app.get("/getAllUsers", (req, res, next) => {
    // grab all user data
    SQLdatabase.all(GET_ALL_USERS, [], (err, userData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with userData on success
        res.send(userData);
    });
});

// get all images
app.get("/getAllImages", (req, res, next) => {
    // grab all image data
    SQLdatabase.all("SELECT * FROM images", (err, imageData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with imageData on success
        res.json(imageData);
    });
});

// get all posts posts
app.get("/getAllPosts", (req, res, next) => {
    // grab all posts data
    SQLdatabase.all(GET_ALL_POSTS, [], (err, postData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with postData on success
        res.json(postData);
    });
});

// get all friendships
app.get("/getAllFriendships", (req, res, next) => {
    // grab all friendships data
    SQLdatabase.all("SELECT * FROM friendships", [], (err, friendshipData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with friendshipData on success
        res.send(friendshipData);
    });
});

// get all UserActions
app.get("/getAllUserActions", (req, res, next) => {
    // grab all user actions data
    SQLdatabase.all("SELECT * FROM userActions", [], (err, userActionsData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with userActionsData on success
        res.send(userActionsData);
    });
});

// get all chats
app.get("/getAllChats", (req, res) => {
    // grab all chat data
    SQLdatabase.all("SELECT * FROM `chats`", (err, chatData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with chatData on success
        res.send(chatData);
    });
});

// get all messages
app.get("/getAllMessages", (req, res, next) => {
    // grab all message data
    SQLdatabase.all("SELECT * FROM messages", [], (err, messageData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with messageData on success
        res.send(messageData);
    });
});

//#endregion DATABASE TEST ENDPOINTS

//#endregion SQL DATABASE SETUP AND QUERIES

//#region ENDPOINTS

//#region GENERAL FUNCTIONALITY

app.post("/search", (req, res) => {
    //set up variables from the request body
    let searchQuery = req.body.search;
    // select firstname, lastname, profile picture and username from any users that part match our search query
    SQLdatabase.all(
        "SELECT firstName, lastName, username, profilePicture, firstname || ' ' || lastname AS full_name FROM users WHERE full_name LIKE '%' || ? || '%' OR username LIKE ? || '%'",
        [searchQuery, searchQuery],
        (err, results) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // respond with results on success
            res.json({
                status: "success",
                results: results,
            });
        }
    );
});

app.get("/refreshSessionStatus", (req, res) => {
    // if userData exists in session
    if (req.session.userData !== undefined) {
        // respond with session exists status and session data
        res.json({
            status: "session-exists",
            isSignedIn: req.session.userData.isSignedIn,
            firstName: req.session.userData.userFirstName,
            lastName: req.session.userData.userLastName,
            username: req.session.userData.loggedInUsername,
            profilePicture: req.session.userData.userProfilePicture,
        });
    } else {
        // respond with no session if no session data found
        res.json("no session");
    }
});

//#endregion GENERAL FUNCTIONALITY

//#region SIGN UP & SIGN IN

app.post("/signUp", (req, res) => {
    //set up variables from the request for better readability
    let {
        signUpEmail,
        signUpUserName,
        signUpFirstName,
        signUpLastName,
        signUpPassword,
        confirmSignUpPassword,
    } = req.body;
    //if both password fields match
    if (signUpPassword === confirmSignUpPassword) {
        //generate salt to store
        let passwordSalt = generatePepper;
        //generate password to store, using password from the confirm field, and the generated salt
        let storePassword = passwordHash(confirmSignUpPassword, passwordSalt);
        //assign default profile picture
        let profilePicture = defaultProfilePicture;
        //Create a new user in the user database with the fields from the form, the default profile picture and the generated password hash and salt
        SQLdatabase.run(
            SIGN_UP_USER,
            [
                signUpEmail,
                signUpUserName,
                signUpFirstName,
                signUpLastName,
                storePassword,
                passwordSalt,
                profilePicture,
            ],
            (err, rows) => {
                if (err) {
                    console.log("failed to add user to database");
                    // if username already exists in database
                    if (
                        err.message ===
                        "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username"
                    ) {
                        console.log("USERNAME ALREADY EXISTS");
                        res.json("duplicate username");
                        return;
                    }
                    // if email already exists in database
                    if (
                        err.message ===
                        "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email"
                    ) {
                        console.log("EMAIL ALREADY EXISTS");
                        res.json("duplicate email");
                        return;
                    }
                    // if any other error case, respond with status and error message
                    res.status(500).send(err.message);
                    return;
                }
                //respond with success
                res.json("sign up success");
            }
        );
        //response if password fields dont match
    } else {
        res.json("PASSWORDS DONT MATCH");
    }
});

app.post("/signin", (req, res) => {
    // pull data from request body for better readbility
    let { email, password } = req.body;
    // search if user exists using email address
    SQLdatabase.get(FIND_USER, email, (err, userData) => {
        if (err) {
            console.log("error at database");
            res.status(500).send(err);
        }
        //assign any returned rows to user variable
        let user = userData;
        //if a user exists, and their stored password matches the output of the hashing function
        // with their password entry..
        if (
            user !== undefined &&
            user.password === passwordHash(password, user.passwordSalt)
        ) {
            // create empty session data to be populated
            req.session.userData = {};
            // apply user data to session variables
            req.session.userData.isSignedIn = true;
            req.session.userData.userFirstName = user.firstName;
            req.session.userData.userLastName = user.lastName;
            req.session.userData.loggedInUsername = user.username;
            req.session.userData.userProfilePicture = user.profilePicture;
            req.session.userData.userCoverPicture = user.coverPicture;
            //respond with user data on succesful login
            res.json({
                status: "success",
                isSignedIn: req.session.userData.isSignedIn,
                firstName: req.session.userData.userFirstName,
                lastName: req.session.userData.userLastName,
                username: req.session.userData.loggedInUsername,
                profilePicture: req.session.userData.userProfilePicture,
                coverPicture: req.session.userData.userCoverPicture,
            });
            // otherwise, credentials are invalid
        } else {
            //respond with failure message
            res.json({
                status: "failed",
                message: "incorrect email or password",
            });
        }
    });
});

app.post("/signout", (req, res) => {
    // delete session
    req.session = null;
    // respond with success
    res.json("success");
});

//#endregion SIGN UP & SIGN IN

//#region UPDATE ACCOUNT INFO

app.post("/updateUserGeneralInfo", (req, res) => {
    //pull variables from request body for better readability
    const {
        firstName,
        lastName,
        aboutMe,
        location,
        education,
        work,
        username,
    } = req.body;
    //update users general information in database
    SQLdatabase.run(
        UPDATE_USER_GENERAL_INFO,
        firstName,
        lastName,
        aboutMe,
        location,
        education,
        work,
        username,
        (err) => {
            if (err) {
                //error response
                res.json("ERROR AT DATABASE");
            }
            //success response
            res.json("success at database");
        }
    );
});

app.post("/updateUserLoginInfo", (req, res) => {
    //pull variables from request body for better readability
    let {
        email,
        password,
        changeEmail,
        changePassword,
        changePasswordConfirm,
    } = req.body;
    //search for user by email
    SQLdatabase.get(FIND_USER, email, (err, userData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // if a user is found, apply the data to user variable
        let user = userData;
        // if a user exists and the password stored matches the output of the hashing function with the entered password plus the stored salt..
        if (
            user !== undefined &&
            user.password === passwordHash(password, user.passwordSalt)
        ) {
            //if the change password field has been updated..
            if (changePassword) {
                // if password and confirm fields match..
                if (changePassword === changePasswordConfirm) {
                    //generate a new salt to store
                    let passwordSalt = generatePepper;
                    //generate a new password hash to store using the hashing function, passing in the new password entry and the newly generated salt
                    let storePassword = passwordHash(
                        changePassword,
                        passwordSalt
                    );
                    // apply the password to the database where the email matches the users
                    SQLdatabase.run(
                        UPDATE_PASSWORD_BY_EMAIL,
                        [storePassword, passwordSalt, email],
                        (err) => {
                            // if error
                            if (err) {
                                // respond with error status and error message
                                res.status(500).send(err.message);
                                return;
                            }
                            // console log success for our confirmation
                            console.log("success with changing password");
                        }
                    );
                }
            }
            // if changeEmail field has been updated
            if (changeEmail) {
                // look up user using their existing email adress
                SQLdatabase.get(
                    LOOK_UP_EMAIL_BY_EMAIL,
                    email,
                    (err, emailFound) => {
                        // if error
                        if (err) {
                            console.log("error getting email");
                            // respond with error status and error message
                            res.status(500).send(err.message);
                            return;
                        }
                        // if no email is returned
                        if (!emailFound) {
                            console.log("no email found");
                            // notify email doesnt exist
                            res.json("Email not found");
                            return;
                        } else {
                            //otherwise, update the email with the new changeEmail entry
                            SQLdatabase.run(
                                UPDATE_EMAIL,
                                [changeEmail, email],
                                (err) => {
                                    // if error
                                    if (err) {
                                        console.log("error changing email");
                                        // respond with error status and error message
                                        res.status(500).send(err.message);
                                        return;
                                    }
                                    console.log("success changing email");
                                }
                            );
                        }
                    }
                );
            }
            //respond with success on completion of changes
            res.json("success with changes");
        } else {
            // password verification doesnt validate, respond with inv credentials
            res.json("incorrect validation");
        }
    });
});

app.post("/changeProfilePicture", upload.single("image"), (req, res) => {
    /*ALREADY RUN THROUGH MULTER*/
    //remove undefined from filename after being processed by multer
    req.body.imageLocations = req.body.imageLocations.replace("undefined", "");
    //remove any commas from filename after being processed by multer
    let image = req.body.imageLocations.replace(",", "");
    // update the profilePicture attached to the user where username matches the logged in users from the request
    SQLdatabase.run(
        "UPDATE users SET profilePicture = ? WHERE username = ?",
        [image, req.body.username],
        (err, result) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // grab users first name and lastname from database by username from request
            SQLdatabase.all(
                "SELECT users.firstName, users.lastName FROM users WHERE username = ? LIMIT 1",
                req.body.username,
                (err, rows) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        res.status(500).send(err.message);
                        return;
                    }
                    //USE A REGULAR FUNCTION DECLARATION AT THE END OF THIS LINE AS this.LastID FOR GETTING THE LATEST ENTRY DOESNT SUPPORT ES6
                    // create a post passing in first and last name with the content about the picture change
                    SQLdatabase.run(
                        ADD_POST_TO_POSTS,
                        [
                            req.body.username,
                            "general",
                            `${rows[0].firstName} ${rows[0].lastName} has changed their profile picture!`,
                            "none",
                            0,
                            0,
                            false,
                        ],
                        function (err, result) {
                            // if error
                            if (err) {
                                // respond with error status and error message
                                res.status(500).send(err.message);
                                return;
                            }
                            // set post Id to the id from the post just created
                            let postId = this.lastID;
                            // insert image into the images database with the post Id above as the relative post Id
                            SQLdatabase.run(
                                "INSERT INTO images (ownerUsername, imageLocation, postId) VALUES (?,?,?)",
                                [req.body.username, image, postId],
                                (err, rows) => {
                                    // if error
                                    if (err) {
                                        // respond with error status and error message
                                        res.status(500).send(err.message);
                                        return;
                                    }
                                    // respond with new image on success
                                    res.json({
                                        profilePicture: req.body.image,
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

app.post("/changeCoverPicture", upload.single("image"), (req, res) => {
    /* ALREADY RAN THROUGH MULTER */
    //remove 'undefined' from the image name currently in the req.body.imageLocatiions space
    req.body.imageLocations = req.body.imageLocations.replace("undefined", "");
    // remove any commas from the string after being processed by multer
    let image = req.body.imageLocations.replace(",", "");
    // update the coverPicture attached to the user where username matches the logged in users from the request
    SQLdatabase.run(
        "UPDATE users SET coverPicture = ? WHERE username = ?",
        [image, req.body.username],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // grab users first name and lastname from database by username from request
            SQLdatabase.all(
                "SELECT users.firstName, users.lastName FROM users WHERE username = ? LIMIT 1",
                req.body.username,
                (err, rows) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        res.status(500).send(err.message);
                        return;
                    }
                    //USE A REGULAR FUNCTION DECLARATION AT THE END OF THIS LINE AS this.LastID FOR GETTING THE LATEST ENTRY DOESNT SUPPORT ES6
                    // create a post passing in first and last name with the content about the picture change
                    SQLdatabase.run(
                        ADD_POST_TO_POSTS,
                        [
                            req.body.username,
                            "general",
                            `${rows[0].firstName} ${rows[0].lastName} has changed their profile cover picture!`,
                            "none",
                            0,
                            0,
                            false,
                        ],
                        function (err, result) {
                            // if error
                            if (err) {
                                // respond with error status and error message
                                res.status(500).send(err.message);
                                return;
                            }
                            // set post Id to the id from the post just created
                            let postId = this.lastID;
                            // insert image into the images database with the post Id above as the relative post Id
                            SQLdatabase.run(
                                "INSERT INTO images (ownerUsername, imageLocation, postId) VALUES (?,?,?)",
                                [req.body.username, image, postId],
                                (err, rows) => {
                                    // if error
                                    if (err) {
                                        // respond with error status and error message
                                        res.status(500).send(err.message);
                                        return;
                                    }
                                    res.json({ coverPicture: req.body.image });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

//#endregion UPDATE ACCOUNT INFO

//#region FEED

app.post("/getFeedFriendsOnly", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    // ready friends array to populate
    let friendsList = [];
    // add the logged in user to the friends array so we also get posts from the user
    friendsList[0] = "'" + user + "'";
    // get all entries from the friendships table that contain the logged in users username
    SQLdatabase.all(GET_ALL_USERS_FRIENDS, [user, user], (err, friendships) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // iterate through each returned friendship, and add the username **that is not** the logged in users username to the friend list above
        friendships.forEach((friendship) =>
            friendship.user1 === user
                ? friendsList.push("'" + friendship.user2 + "'")
                : friendsList.push("'" + friendship.user1 + "'")
        );
        // if selected circle is general
        if (req.body.circle === "general") {
            // select all posts and posters firstname, lastname and profile picture where the author of the posts username exists in the above friend list
            SQLdatabase.all(
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
                    posts.forEach((post) => {
                        // add the current iterations postId to the postIds list
                        postIds.push(post.id);
                        // ready and empty image list to populate with any/all images relating to this post
                        post.images = [];
                    });
                    // get all images from the database from the images table relating to any of the postId's in the above list
                    SQLdatabase.all(
                        "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (" +
                            postIds.join(",") +
                            ")",
                        (err, images) => {
                            // for each image in the images list, loop through the posts and add the image to the post if postId and relativePostId's match
                            images.forEach((image) =>
                                posts.forEach((post) => {
                                    image.postId === post.id
                                        ? post.images.push(image.imageLocation)
                                        : "";
                                })
                            );
                            // if error
                            if (err) {
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
                }
            );
        } else {
            // select all posts and posters firstname, lastname and profile picture
            // where the author of the posts username exists in the above friend list
            // but only if the posts circle matches the circle coming in from the request
            SQLdatabase.all(
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
                    // get all images from the database from the images table relating to any of the postId's in the above list
                    SQLdatabase.all(
                        "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (" +
                            postIds.join(",") +
                            ")",
                        (err, images) => {
                            // for each image in the images list, loop through the posts and add the image to the post if postId and relativePostId's match
                            images.forEach((image) =>
                                posts.forEach((post) => {
                                    image.postId === post.id
                                        ? post.images.push(image.imageLocation)
                                        : "";
                                })
                            );
                            // if error
                            if (err) {
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
    SQLdatabase.get(
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
            res.json(userData);
        }
    );
});

app.post("/getUserGeneralInfo", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    // get general user info from the users table where username matches user in the request
    SQLdatabase.get(
        GET_USER_GENERAL_INFO_BY_USERNAME,
        user,
        (err, userData) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            res.json(userData);
        }
    );
});

app.post("/getAllCircles", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    SQLdatabase.all("SELECT * FROM circles", (err, circles) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        SQLdatabase.get(
            GET_USERS_FOLLOWED_CIRCLES,
            user,
            (err, followedCircles) => {
                // turn the returned string of circles into an array
                let currentCircles = followedCircles.circles.split(",");
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
            }
        );
    });
});

app.post("/addCircle", (req, res) => {
    //set up variables from the request body
    let { user, circleName } = req.body;
    SQLdatabase.get(GET_USERS_FOLLOWED_CIRCLES, user, (err, circles) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // turn the returned string of circles into an array
        let currentCircles = circles.circles.split(",");
        // add the circle from the request to the array
        currentCircles.push(circleName);
        // ready a new string format list
        let newCirclesList = "";
        // add each element of the array to the string, seperated by a comma
        currentCircles.forEach((circle) =>
            circle.length > 2 ? (newCirclesList += circle + ",") : ""
        );
        // update the circles column in the users table where the username matches the request
        SQLdatabase.run(
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
    SQLdatabase.get(GET_USERS_FOLLOWED_CIRCLES, user, (err, circles) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }

        // turn the returned string of circles into an array
        let currentCircles = circles.circles.split(",");
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

        SQLdatabase.run(
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
    SQLdatabase.get(GET_USERS_FOLLOWED_CIRCLES, user, (err, circles) => {
        // turn the returned string of circles into an array
        let currentCircles = circles.circles.split(",");
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
    SQLdatabase.all(GET_ALL_USERS_FRIENDS, [user, user], (err, friendships) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // iterate through each returned friendship, and add the username **that is not** the logged in users username to the friend list above
        friendships.forEach((friendship) =>
            friendship.user1 === user
                ? friendsList.push("'" + friendship.user2 + "'")
                : friendsList.push("'" + friendship.user1 + "'")
        );
        // get first name, last name and profile picture of all users that appear in the new friendsList array
        SQLdatabase.all(
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
    SQLdatabase.all(GET_ALL_USERS_FRIENDS, user, user, (err, friendships) => {
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
    SQLdatabase.run(
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
    SQLdatabase.all(GET_NOTIFICATIONS, user, (err, notifications) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        let unseenNotifications = [];
        notifications.forEach((notification) =>
            !notification.seen ? unseenNotifications.push(notification) : ""
        );
        // get all chats where user and matching 'seen by user' is the logged in user and false, so we only get unseen message notifications
        SQLdatabase.all(
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
    SQLdatabase.run(
        "DELETE FROM userActions WHERE actionId = ?",
        actionId,
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

//#endregion GET USER INFO

//#region PROFILE DATA

app.post("/getUserProfile", (req, res) => {
    //set up variables from the request body
    let { loggedInUsername, userProfileToGet } = req.body;
    // check the database for any existing friendships containing both the logged in user and the profile in question
    SQLdatabase.all(
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
            SQLdatabase.get(
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
                        profileData: userData,
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
    SQLdatabase.all(GET_ALL_IMAGES_BY_USER, user, (err, images) => {
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
    SQLdatabase.all(
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
                SQLdatabase.all(
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
                        SQLdatabase.all(
                            "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (" +
                                postIds.join(",") +
                                ")",
                            (err, images) => {
                                images.forEach((image) =>
                                    posts.forEach((post) => {
                                        image.postId === post.id
                                            ? post.images.push(
                                                  image.imageLocation
                                              )
                                            : "";
                                    })
                                );
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
                SQLdatabase.all(
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
                        SQLdatabase.all(
                            "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (" +
                                postIds.join(",") +
                                ")",
                            (err, images) => {
                                images.forEach((image) =>
                                    posts.forEach((post) => {
                                        image.postId === post.id
                                            ? post.images.push(
                                                  image.imageLocation
                                              )
                                            : "";
                                    })
                                );
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
    SQLdatabase.run(
        "INSERT INTO messages (chatId, sender, message, recipient, date, seen) VALUES (?, ?, ?, ?, datetime(), ?)",
        [chatId, sender, message, recipient, false],
        (err, rows) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            if (sender === user1) {
                SQLdatabase.run(
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
                SQLdatabase.run(
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
    SQLdatabase.all(
        GET_USERS_CHATS,
        [user, user, user, user],
        (err, chatData) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            res.json(chatData);
        }
    );
});

app.post("/getChat", async (req, res) => {
    //set up variables from the request body
    let { user, chatId, partner } = req.body;
    if (chatId === false || chatId === undefined) {
        await SQLdatabase.get(
            "SELECT chatId FROM chats WHERE ((user1 = ? OR user2 = ?) AND (user1 = ? OR user2 = ?))",
            [req.body.user, req.body.user, req.body.partner, req.body.partner],
            async function (err, result) {
                // if error
                if (err) {
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                if (result === undefined) {
                    // create a chat passing in logged in users username as sender, recipient, and message
                    SQLdatabase.run(
                        "INSERT INTO chats (user1, user2, seenByUser1, seenByUser2, lastActive) VALUES (?, ?, ?, ?, datetime())",
                        [user, partner, true, false],
                        async function (err) {
                            // if error
                            if (err) {
                                // respond with error status and error message
                                res.status(500).send(err.message);
                                return;
                            }
                            // set chatId to the id of the data just added
                            chatId = this.lastID;
                        }
                    );
                } else {
                    chatId = result.chatId;
                }
                if (chatId) {
                    SQLdatabase.all(
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
                            SQLdatabase.all(
                                GET_MESSAGES_BY_CHAT_ID,
                                [chatId],
                                (err, messages) => {
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
                                }
                            );
                        }
                    );
                }
            }
        );
    } else {
        SQLdatabase.all(
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
                SQLdatabase.all(
                    GET_MESSAGES_BY_CHAT_ID,
                    [chatId],
                    (err, messages) => {
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
                    }
                );
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
    SQLdatabase.run(
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
    SQLdatabase.run(
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
    // OLD STYLE FUNCTION AT THE END FOR this.lastID SUPPORT (not supported by ES6 yet)
    // add post to posts table with corresponding username, circle, content, recipient, 0 likes, 0 dislikes, and strict status
    SQLdatabase.run(
        ADD_POST_TO_POSTS,
        [username, circle, postContent, recipient, 0, 0, postStrict],
        function (err) {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // this.lastId returns the ID of the entry just added
            let postId = this.lastID;
            // if image locations in the request are defined
            if (req.body.imageLocations !== undefined) {
                // loop through each image, if the image name is greater than 0 characters (if it has a value)..
                images.forEach((image) =>
                    image.length > 0
                        ? // insert the image into the images table with the logged in user as the owner, image name as location and the post ID
                          //returned above as the relative post
                          SQLdatabase.run(
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
    SQLdatabase.run(
        "INSERT INTO userActions (type, sender, recipient, message, seen, approved, date, relativePost) VALUES (?,?,?,?,?,?, DATE(),?)",
        ["reaction", sender, recipient, message, false, false, postId],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
        }
    );
    // update the likes or dislikes on the post reacted to
    SQLdatabase.run(
        UPDATE_POST_VOTES_BY_POST_ID,
        [like, dislike, postId],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // respond with success message on success
            res.json("success applying like to post at database");
        }
    );
});

app.post("/clearNotifications", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    SQLdatabase.run(
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
    SQLdatabase.get(
        "SELECT * FROM userActions WHERE type = ? AND sender = ?",
        [type, sender],
        (err, rows) => {
            if (err) {
                res.json(err);
                return;
            }
            // if nothing is found..
            if (!rows) {
                // insert a new user action into the database witht he above readied data
                SQLdatabase.run(
                    "INSERT INTO userActions (type, sender, recipient, message, seen,approved, date, relativePost) VALUES(?,?,?,?,?,?,date(),?)",
                    [
                        type,
                        sender,
                        recipient,
                        message,
                        seen,
                        false,
                        relativePost,
                    ],
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
                SQLdatabase.run(
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
    SQLdatabase.run(
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
            SQLdatabase.run(
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
    SQLdatabase.run(
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
