var express = require("express");
const { request } = require("express");

var express = require("express");
var router = express.Router();
const db = require("../config/database");

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
const POST_QUESTION =
    "INSERT INTO questions (authorID, author, relativePostID, date, title, text, code, language, category, authorProfilePicture, score) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?)";

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

router.post("/newPost", upload.array("imagesArray", 4), (req, res) => {
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

router.post("/votePost", (req, res) => {
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

router.post("/voteQuestion", (req, res) => {
    // get the vote status from request
    let vote = req.body.vote;
    // get post to apply vote to
    let postID = req.body.postID;
    //vote up route
    if (vote === "up") {
        db.query(
            "UPDATE questions SET score = score + 1 WHERE postID = ?",
            postID,
            (err) => {
                if (err) {
                    console.log(err.message);
                }
            }
        );
        // vote down route
    } else {
        db.query(
            "UPDATE questions SET score = score - 1 WHERE postID = ?",
            postID,
            (err) => {
                if (err) {
                    console.log(err.message);
                }
            }
        );
    } //respond with success
    res.json({
        status: "success",
    });
});

router.post("/postQuestion", (req, res) => {
    // set up post data from request

    let postData = req.body;
    console.log(postData);
    // if relative post is zero, its not a reply
    if (postData.relativePostID === 0) {
        //increment asked by one on account
        db.query(
            "UPDATE users SET asked = asked + 1 WHERE username = ?",
            postData.authorID,
            (err) => {
                if (err) {
                    console.log(err.message);
                }
            }
        );
    } else {
        db.query(
            // otherwise increment answered
            "UPDATE users SET answered = answered + 1 WHERE username = ?",
            postData.authorID,
            (err) => {
                if (err) {
                    console.log(err.message);
                }
            }
        );
    }
    db.query(
        POST_QUESTION,
        [
            postData.authorID,
            postData.author,
            postData.relativePostID,
            postData.title,
            postData.text,
            postData.code,
            postData.language,
            postData.category,
            postData.authorProfilePicture,
            0,
        ],
        (err, rows) => {
            if (err) {
                console.log("failed to add post to database");
                console.log(err.message);
                res.status(500).send(err.message);
                return;
            }
            //respond with success
            res.json({
                status: "success",
                id: rows.insertId,
            });
        }
    );
});

//#en
module.exports = router;
