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

//#region MESSAGING

router.post("/newMessage", (req, res) => {
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

router.post("/getAllUsersChats", (req, res) => {
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

router.post("/getChat", async (req, res) => {
    //set up variables from the request body

    console.log(req.body);
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
                            let userToUpdate = "";
                            if (chatData[0].user1 === user) {
                                userToUpdate = "seenByUser1";
                            } else if (chatData[0].user2 === user) {
                                userToUpdate = "seenByUser2";
                            }
                            db.query(
                                `UPDATE chats SET ${userToUpdate} = ? WHERE chatId = ?`,
                                [true, chatId],
                                (err) => {
                                    if (err) {
                                        // respond with error status and error message
                                        return;
                                    }
                                }
                            );

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
                let userToUpdate = "";
                if (chatData[0].user1 === user) {
                    userToUpdate = "seenByUser1";
                } else if (chatData[0].user2 === user) {
                    userToUpdate = "seenByUser2";
                }
                db.query(
                    `UPDATE chats SET ${userToUpdate} = ? WHERE chatId = ?`,
                    [true, chatId],
                    (err) => {
                        if (err) {
                            // respond with error status and error message
                            return;
                        }
                    }
                );
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

//#endregion MESSAGING

module.exports = router;
