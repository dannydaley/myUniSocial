var express = require("express");
var express = require("express");
var router = express.Router();
const db = require("../config/database");
var nodemailer = require("nodemailer");
var randomstring = require("randomstring");

const { passwordHash, generateSalt } = require("../security");

//#region EMAILER SETUP

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS,
    },
});

//#endregion EMAILER SETUP

//#regin IMAGES AND IMAGE UPLOAD HANDLING

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

//#region SQL QUERIES
const CHECK_THAT_USERS_ARE_FRIENDS =
    "SELECT * FROM friendships WHERE (user1 = ? OR user2 = ?) AND (user1 = ? OR user2 = ?)";
const GET_USER_GENERAL_INFO_BY_USERNAME =
    "SELECT firstName, lastName, aboutMe, location, education, work, profilePicture, coverPicture, asked, answered FROM users WHERE username = ?";
const UPDATE_PASSWORD_BY_EMAIL =
    "UPDATE users SET password = ?, passwordSalt = ? WHERE email = ?";
const LOOK_UP_EMAIL_BY_EMAIL = "SELECT email FROM users WHERE email = ?";
const UPDATE_EMAIL = "UPDATE users SET email = ? WHERE email = ?";
const UPDATE_USER_GENERAL_INFO =
    "UPDATE users SET firstName = ?, lastName = ?, aboutMe = ?, location = ?, education = ?, work = ? WHERE username = ?";
const FIND_USER = "SELECT * FROM users WHERE email = ?";
const GET_POSTS_BY_AUTHOR_OR_RECIPIENT =
    "SELECT posts.*, users.firstName, users.lastName, users.profilePicture FROM `posts` LEFT OUTER JOIN `users` ON `posts`.`author` = `users`.`username` WHERE author = ? OR recipient = ? ORDER BY id DESC";
const GET_POSTS_BY_AUTHOR_BY_CIRCLE =
    "SELECT * FROM `posts` WHERE author = ? AND circle = ? ORDER BY id DESC";
const ADD_POST_TO_POSTS = "INSERT INTO `posts` SET ?, date = NOW()";
const APPLY_PROFILE_PICTURE_AT_USERNAME =
    "UPDATE users SET profilePicture = ? WHERE username = ?";
const GET_NAMES_BY_USERNAME =
    "SELECT users.firstName, users.lastName FROM users WHERE username = ? LIMIT 1";
const GET_IMAGES_BY_POST_ID =
    "SELECT images.imageLocation, images.postId FROM `images` WHERE postId IN  (";
const ADD_IMAGE =
    "INSERT INTO images (ownerUsername, imageLocation, postId) VALUES (?,?,?)";
const APPLY_COVER_PICTURE_AT_USERNAME =
    "UPDATE users SET coverPicture = ? WHERE username = ?";

const DELETE_USER_FROM_USERS = "DELETE FROM users WHERE username = ?";
const DELETE_USERS_POSTS = "DELETE FROM posts WHERE author = ?";
const DELETE_USERS_IMAGES = "DELETE FROM images WHERE ownerUsername = ?";
const DELETE_USERS_FRIENDSHIPS =
    "DELETE FROM friendships WHERE user1 = ? OR user2 = ?";
const DELETE_USERS_USER_ACTIONS =
    "DELETE FROM userActions WHERE sender = ? OR recipient = ?";
const DELETE_USERS_CHATS = "DELETE FROM chats WHERE user1 = ? OR user2 = ?";
const DELETE_USERS_MESSAGES =
    "DELETE FROM messages WHERE sender = ? OR recipient = ?";
const DELETE_USERS_QUESTIONS = "DELETE FROM questions WHERE authorID = ?";

router.post("/signoutAndDelete", (req, res, next) => {
    let userId = req.body.userId;
    let password = req.body.password;
    // search if user exists using email address
    db.query(
        "SELECT * FROM users WHERE username = ?",
        userId,
        (err, userData) => {
            if (err) {
                console.log("error at database");
                res.status(500).send(err);
            }
            //assign any returned rows to user variable
            let user = userData[0];
            //if a user exists, and their stored password matches the output of the hashing function
            // with their password entry..
            if (
                user !== undefined &&
                user.password === passwordHash(password, user.passwordSalt)
            ) {
                db.query(DELETE_USERS_POSTS, userId, (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                db.query(DELETE_USERS_IMAGES, userId, (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                db.query(DELETE_USERS_FRIENDSHIPS, [userId, userId], (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                db.query(DELETE_USERS_USER_ACTIONS, [userId, userId], (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                db.query(DELETE_USERS_CHATS, [userId, userId], (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                db.query(DELETE_USERS_MESSAGES, [userId, userId], (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                db.query(DELETE_USERS_QUESTIONS, userId, (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                db.query(DELETE_USER_FROM_USERS, userId, (err) => {
                    // if error
                    if (err) {
                        // respond with error status and error message
                        console.log(err.message);
                        return;
                    }
                });
                // delete session
                req.session = null;
                // respond with success
                res.json("success deleting user data");
            } else {
                // respond with success
                res.json("incorrect password");
            }
        }
    );
});

//#endregion SQL QUERIES

//#region ENDPOINTS
router.post("/refreshData", (req, res) => {
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

router.post("/updateUserGeneralInfo", (req, res) => {
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
    db.query(
        UPDATE_USER_GENERAL_INFO,
        [firstName, lastName, aboutMe, location, education, work, username],
        (err) => {
            if (err) {
                //error response
                console.log(err);
                res.json("ERROR AT DATABASE");
            }
            //success response
            res.json("success at database");
        }
    );
});

router.post("/updateUserLoginInfo", (req, res) => {
    //pull variables from request body for better readability
    let {
        email,
        password,
        changeEmail,
        changePassword,
        changePasswordConfirm,
    } = req.body;
    //search for user by email
    db.query(FIND_USER, email, (err, userData) => {
        // if error
        if (err) {
            console.log(err);
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // if a user is found, apply the data to user variable
        let user = userData[0];
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
                    let passwordSalt = generateSalt;
                    //generate a new password hash to store using the hashing function, passing in the new password entry and the newly generated salt
                    let storePassword = passwordHash(
                        changePassword,
                        passwordSalt
                    );
                    // apply the password to the database where the email matches the users
                    db.query(
                        UPDATE_PASSWORD_BY_EMAIL,
                        [storePassword, passwordSalt, email],
                        (err) => {
                            // if error
                            if (err) {
                                console.log(err);
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
                db.query(LOOK_UP_EMAIL_BY_EMAIL, email, (err, emailFound) => {
                    // if error
                    if (err) {
                        console.log(err);
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
                        db.query(UPDATE_EMAIL, [changeEmail, email], (err) => {
                            // if error
                            if (err) {
                                console.log("error changing email");
                                // respond with error status and error message
                                res.status(500).send(err.message);
                                return;
                            }
                            console.log("success changing email");
                        });
                    }
                });
            }

            //respond with success on completion of changes
            res.json("success with changes");
        } else {
            // password verification doesnt validate, respond with inv credentials
            res.json("incorrect validation");
        }
    });
});

router.post("/changeProfilePicture", upload.single("image"), (req, res) => {
    /*ALREADY RUN THROUGH MULTER*/
    //remove undefined from filename after being processed by multer
    req.body.imageLocations = req.body.imageLocations.replace("undefined", "");
    //remove any commas from filename after being processed by multer
    let image = req.body.imageLocations.replace(",", "");
    // update the profilePicture attached to the user where username matches the logged in users from the request
    db.query(
        APPLY_PROFILE_PICTURE_AT_USERNAME,
        [image, req.body.username],
        (err, result) => {
            // if error
            if (err) {
                console.log(err);
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // grab users first name and lastname from database by username from request
            db.query(GET_NAMES_BY_USERNAME, req.body.username, (err, rows) => {
                // if error
                if (err) {
                    console.log(err);
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                //USE A REGULAR FUNCTION DECLARATION AT THE END OF THIS LINE AS this.LastID FOR GETTING THE LATEST ENTRY DOESNT SUPPORT ES6
                // create a post passing in first and last name with the content about the picture change
                db.query(
                    ADD_POST_TO_POSTS,
                    {
                        author: req.body.username,
                        circle: "general",
                        content: `${rows[0].firstName} ${rows[0].lastName} has changed their profile picture!`,
                        recipient: "none",
                        likes: 0,
                        dislikes: 0,
                        postStrict: false,
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
                        // insert image into the images database with the post Id above as the relative post Id
                        db.query(
                            ADD_IMAGE,
                            [req.body.username, image, postId],
                            (err, rows) => {
                                // if error
                                if (err) {
                                    console.log(err);
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
            });
        }
    );
});

router.post("/changeCoverPicture", upload.single("image"), (req, res) => {
    /* ALREADY RAN THROUGH MULTER */
    //remove 'undefined' from the image name currently in the req.body.imageLocatiions space
    req.body.imageLocations = req.body.imageLocations.replace("undefined", "");
    // remove any commas from the string after being processed by multer
    let image = req.body.imageLocations.replace(",", "");
    // update the coverPicture attached to the user where username matches the logged in users from the request
    db.query(
        APPLY_COVER_PICTURE_AT_USERNAME,
        [image, req.body.username],
        (err) => {
            // if error
            if (err) {
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // grab users first name and lastname from database by username from request
            db.query(GET_NAMES_BY_USERNAME, req.body.username, (err, rows) => {
                // if error
                if (err) {
                    // respond with error status and error message
                    res.status(500).send(err.message);
                    return;
                }
                //USE A REGULAR FUNCTION DECLARATION AT THE END OF THIS LINE AS this.LastID FOR GETTING THE LATEST ENTRY DOESNT SUPPORT ES6
                // create a post passing in first and last name with the content about the picture change
                db.query(
                    ADD_POST_TO_POSTS,
                    {
                        author: req.body.username,
                        circle: "general",
                        content: `${rows[0].firstName} ${rows[0].lastName} has changed their profile cover picture!`,
                        recipient: "none",
                        likes: 0,
                        dislikes: 0,
                        postStrict: false,
                    },
                    function (err, results) {
                        // if error
                        if (err) {
                            // respond with error status and error message
                            res.status(500).send(err.message);
                            return;
                        }
                        // set post Id to the id from the post just created
                        let postId = results.insertId;
                        // insert image into the images database with the post Id above as the relative post Id
                        db.query(
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
            });
        }
    );
});

router.post("/getFeedByUser", (req, res) => {
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
                            GET_IMAGES_BY_POST_ID + postIds.join(",") + ")",
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
                            GET_IMAGES_BY_POST_ID + postIds.join(",") + ")",
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

router.post("/getUserGeneralInfo", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    // get general user info from the users table where username matches user in the request
    db.query(GET_USER_GENERAL_INFO_BY_USERNAME, user, (err, userData) => {
        // if error
        if (err) {
            console.log(err);
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        res.json(userData[0]);
    });
});

router.post("/resetPassword", (req, res) => {
    // user email to send to and locate profile
    let email = req.body.email;
    // generate new temporary password
    let password = randomstring.generate();
    // generate a salt from the pepper-gen
    let passwordSalt = generateSalt;
    //generate a new password hash to store using the hashing function, passing in the new password entry and the newly generated salt
    let storePassword = passwordHash(password, passwordSalt);
    // apply the password to the database where the email matches the users
    db.query(
        UPDATE_PASSWORD_BY_EMAIL,
        [storePassword, passwordSalt, email],
        (err, rows) => {
            // if error
            if (err) {
                console.log(err);
                // respond with error status and error message
                res.status(500).send(err.message);
                return;
            }
            // send email if rows have been affected, meaning the account exists
            if (rows.affectedRows) {
                // console log success for our confirmation
                var mailOptions = {
                    from: "noreply.myunisocial@gmail.com",
                    // this doesnt seem to work with falmouth emails, must fix
                    // to: emailToSend,
                    to: email,
                    subject: "myUniSocial password reset",
                    text:
                        "Please log in with this temporary password and reset it in account settings immediately. \n Password: " +
                        password,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
                var mailOptionsNoReply = {
                    from: "noreply.myunisocial@gmail.com",
                    // this doesnt seem to work with falmouth emails, must fix
                    // to: emailToSend,
                    to: "noreply.myunisocial@gmail.com",
                    subject: "myUniSocial password reset",
                    text:
                        "reset for email: " +
                        email +
                        "\n Password: " +
                        password,
                };
                transporter.sendMail(
                    mailOptionsNoReply,
                    function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Email sent: " + info.response);
                        }
                    }
                );
                // respond with success
                res.json({ status: "success" });
            } else {
                // respond with failure, notifying no account exists with that email.
                res.json({ status: "not found" });
            }
        }
    );
});

//#endregion ENDPOINTS

module.exports = router;
