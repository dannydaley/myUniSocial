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

router.post("/getUsersCircles", (req, res) => {
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

router.post("/getAllCircles", (req, res) => {
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

router.post("/addCircle", (req, res) => {
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

router.post("/deleteCircle", (req, res) => {
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

module.exports = router;
