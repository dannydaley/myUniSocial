var express = require("express");
var router = express.Router();
const db = require("../config/database");

//JSON files for dummy data on table builds
let postDataJSON = require("../database/posts.json");
let userDataJSON = require("../database/users.json");
let imagesDataJSON = require("../database/images.json");
let friendshipsDataJSON = require("../database/friendships.json");
let userActionsDataJSON = require("../database/userActions.json");
let chatsDataJSON = require("../database/chats.json");
let messagesDataJSON = require("../database/messages.json");
let circlesDataJSON = require("../database/circles.json");
let questionsDataJSON = require("../database/questions.json");

const GET_ALL_QUESTIONS = "SELECT * FROM `questions` ORDER BY postID DESC";

//#region SQL SETUP ENDPOINTS

// users table setup endpoint
router.get("/usersSetup", (req, res, next) => {
    db.query(() => {
        //delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `users`");
        //recreate the users table
        db.query(
            "CREATE TABLE `users` (id INTEGER PRIMARY KEY AUTO_INCREMENT, username varchar(255) UNIQUE, firstName varchar(255), lastName varchar(255), email varchar(255) UNIQUE, password varchar(255), passwordSalt varchar(512), aboutMe text, course varchar(255), year int, location varchar(255), education varchar(255), work varchar(255), profilePicture varchar(255), coverPicture varchar(255), circles text, asked int, answered int)"
        );
        //create array of users from the dummy data JSON file
        let users = userDataJSON.users;
        // insert each element in the array of objects into the users table in the database
        users.forEach((user) => {
            // SQL query to run
            db.query(
                "INSERT INTO `users` (username, firstName, lastName, email, password, passwordSalt, aboutMe, course, year, location, education, work, profilePicture, coverPicture, circles, asked, answered) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?)",
                // values passed in from current iteration of the users array
                [
                    user.username,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.password,
                    user.passwordSalt,
                    user.aboutMe,
                    user.course,
                    user.year,
                    user.location,
                    user.education,
                    user.work,
                    user.profilePicture,
                    user.coverPicture,
                    user.circles,
                    user.asked,
                    user.answered,
                ]
            );
        });
    });
    // respond with success page
    console.log("users table set up");
    res.send("user-db-done");
});

// posts table setup endpoint
router.get("/postsSetup", (req, res, next) => {
    db.query(() => {
        // delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `posts`");
        // recreate the posts table
        db.query(
            "CREATE TABLE `posts` ( id INTEGER PRIMARY KEY AUTO_INCREMENT, author varchar(255), content text,  date varchar(255), circle varchar(255), recipient varchar(255), likes int, dislikes int, postStrict bool)"
        );
        //create array of post objects from the dummy data JSON file
        let posts = postDataJSON.entries;
        // insert each element in the array of objects into the posts table in the database
        posts.forEach((post) => {
            // SQL query to run
            db.query(
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
router.get("/imagesSetup", (req, res, next) => {
    db.query(() => {
        // delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `images`");
        // recreate images table
        db.query(
            "CREATE TABLE `images` ( ownerUsername varchar(255), imageLocation varchar(255), postId int)"
        );
        //create array of image objects from the dummy data JSON file
        let images = imagesDataJSON.images;
        // insert each element in the array of objects into the images table in the database
        images.forEach((image) => {
            // SQL query to run
            db.query(
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
router.get("/friendshipsSetup", (req, res, next) => {
    db.query(() => {
        //delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `friendships`");
        // recreate friendships table
        db.query(
            "CREATE TABLE `friendships` ( user1 varchar(255), user2 varchar(255))"
        );
        //create array of friendship objects from the dummy data JSON file
        let friendships = friendshipsDataJSON.friendships;
        // insert each element in the array of objects into the friendships table in the database
        friendships.forEach((friendship) => {
            // SQL query to run
            db.query(
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

// user actions setup endpoint
router.get("/userActionsSetup", (req, res, next) => {
    db.query(() => {
        //delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `userActions`");
        // recreate userActions table
        db.query(
            "CREATE TABLE `userActions` ( actionId INTEGER PRIMARY KEY AUTO_INCREMENT, type varchar(255), sender varchar(255), recipient varchar(255), message varchar(255), seen int, approved int, date varchar(255), relativePost int)"
        );
        //create array of userActions from the dummy data JSON file
        let rows = userActionsDataJSON.userActions;
        // insert each element in the array of object into the userActions table in the database
        rows.forEach((row) => {
            // SQL query to run
            db.query(
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

// chats setup endpoint
router.get("/chatsSetup", (req, res, next) => {
    db.query(() => {
        // delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `chats`");
        // recreate chats table
        db.query(
            "CREATE TABLE `chats` ( chatId INTEGER PRIMARY KEY AUTO_INCREMENT, user1 varchar(255), user2 varchar(255), seenByUser1 bool, seenByUser2 bool, lastActive varchar(255))"
        );
        //create array of chats from the dummy data JSON file
        let chats = chatsDataJSON.chats;
        // insert each element in the array of objects into the chats table in the database
        chats.forEach((chat) => {
            // SQL query to run
            db.query(
                "INSERT INTO `chats` (chatId, user1, user2, seenByUser1, seenByUser2, lastActive) VALUES(?,?,?,?,?, NOW())",
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

// messages setup endpoint
router.get("/messagesSetup", (req, res, next) => {
    db.query(() => {
        //delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `messages`");
        // recreate messages table
        db.query(
            "CREATE TABLE `messages` ( messageId INTEGER PRIMARY KEY AUTO_INCREMENT,chatId INTEGER,  sender varchar(255), recipient varchar(255), message text, date varchar(255), seen bool)"
        );
        //create array of messages from the dummy data JSON file
        let messages = messagesDataJSON.messages;
        // insert each element in the array of objects into the messages table in the database
        messages.forEach((message) => {
            // SQL query to run
            db.query(
                "INSERT INTO `messages` (chatId, sender, recipient, message, date, seen) VALUES(?,?,?,?,NOW(),?)",
                // values passed in from current iteration of the messages array
                [
                    message.chatId,
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
router.get("/circlesSetup", (req, res, next) => {
    db.query(() => {
        //delete the table if it exists..
        db.query("DROP TABLE IF EXISTS `circles`");
        // recreate circles table
        db.query(
            "CREATE TABLE `circles` ( circleName varchar(255), users INT)"
        );
        //create array of circle objects from the dummy data JSON file
        let circles = circlesDataJSON.circles;
        // insert each element in the array of objects into the circle table in the database
        circles.forEach((circle) => {
            // SQL query to run
            db.query(
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

router.get("/questionsSetup", (req, res) => {
    db.query(() => {
        // delete any existing user table
        db.query("DROP TABLE IF EXISTS `questions`"),
            (err) => {
                if (err) {
                    console.log(err.message);
                }
            };
        //rebuild the users table
        db.query(
            "CREATE TABLE `questions` (postID INTEGER PRIMARY KEY AUTO_INCREMENT, author varchar(255), authorID varchar(255), authorProfilePicture VARCHAR(255), date varchar(255), category varchar(255), score INTEGER, relativePostID INTEGER, title varchar(255), text TEXT, code TEXT, language varchar(255))",
            // "CREATE TABLE `posts` ( id INTEGER PRIMARY KEY AUTO_INCREMENT, author varchar(255), content text,  date varchar(255), circle varchar(255), recipient varchar(255), likes int, dislikes int, postStrict bool)"
            (err) => {
                if (err) {
                    console.log(err.message);
                }
            }
        );
        let questions = questionsDataJSON.entries;
        questions.forEach((question) => {
            db.query(
                "INSERT INTO questions (author, authorID, authorProfilePicture, date, category, score, relativePostID, title, text, code, language) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                // pass in values from the json objects
                [
                    question.author,
                    question.authorID,
                    question.authorProfilePicture,
                    question.date,
                    question.category,
                    question.score,
                    question.relativePostID,
                    question.title,
                    question.text,
                    question.code,
                    question.language,
                ],
                (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                }
            );
        });
    });
    console.log("questions table set up complete");
    res.send("Questions table setup complete");
});
//#endregion SQL SETUP ENDPOINTS

//#region DATABASE TEST ENDPOINTS

// get all users
router.get("/getAllUsers", (req, res, next) => {
    // grab all user data
    db.query("SELECT * FROM users", [], (err, userData) => {
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
router.get("/getAllImages", (req, res, next) => {
    // grab all image data
    db.query("SELECT * FROM images", (err, imageData) => {
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
router.get("/getAllPosts", (req, res, next) => {
    // grab all posts data
    db.query(GET_ALL_POSTS, [], (err, postData) => {
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
router.get("/getAllFriendships", (req, res, next) => {
    // grab all friendships data
    db.query("SELECT * FROM friendships", [], (err, friendshipData) => {
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
router.get("/getAllUserActions", (req, res, next) => {
    // grab all user actions data
    db.query("SELECT * FROM userActions", [], (err, userActionsData) => {
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
router.get("/getAllChats", (req, res) => {
    // grab all chat data
    db.query("SELECT * FROM `chats`", (err, chatData) => {
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
router.get("/getAllMessages", (req, res, next) => {
    // grab all message data
    db.query("SELECT * FROM messages", [], (err, messageData) => {
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

// get all users
router.get("/getAllQuestions", (req, res, next) => {
    // grab all user data
    db.query(GET_ALL_QUESTIONS, [], (err, postData) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with userData on success
        res.send(postData);
    });
});

//#endregion DATABASE TEST ENDPOINTS

//#endregion SQL DATABASE SETUP AND QUERIES
module.exports = router;
