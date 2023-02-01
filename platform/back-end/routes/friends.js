var express = require("express");
var express = require("express");
var router = express.Router();
const db = require("../config/database");

const GET_ALL_USERS_FRIENDS =
    "SELECT * FROM friendships WHERE user1 =? OR user2 = ?";

router.post("/getFriends", (req, res) => {
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

router.post("/deleteFriend", (req, res) => {
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

router.post("/friendRequest", (req, res) => {
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

router.post("/confirmFriendRequest", (req, res) => {
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

router.post("/refuseFriendRequest", (req, res) => {
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

router.post("/getAllFriends", (req, res) => {
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

module.exports = router;
