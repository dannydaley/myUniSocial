var express = require("express");
const { request } = require("express");

var express = require("express");
var router = express.Router();
const db = require("../config/database");
const socket = require("../socket");

//#region SQL QUERIES

const GET_NOTIFICATIONS =
    "SELECT userActions.* , users.firstName, users.lastName FROM `userActions` LEFT OUTER JOIN `users` ON `userActions`.`sender` = `users`.`username` WHERE recipient = ? ORDER BY actionId DESC LIMIT 10";

const GET_ALL_CHATS_UNSEEN_BY_USER =
    "SELECT * FROM chats WHERE `user1` = ? AND `seenByuser1` = false OR `user2` = ? AND `seenByUser2` = false";

const DELETE_SEEN_NOTIFICATIONS =
    "DELETE FROM userActions WHERE recipient = ? AND seen = ?";

const DELETE_NOTIFICATION_BY_ACTION_ID =
    "DELETE FROM userActions WHERE actionId = ?";

const SET_NOTIFICATION_AS_SEEN_BY_ACTION_ID =
    "UPDATE userActions SET seen = true WHERE actionId = ?";

//#endregion SQL QUERIES

//#region ENDPOINTS

router.post("/getNotifications", (req, res) => {
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
            GET_ALL_CHATS_UNSEEN_BY_USER,
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

router.post("/clearSingleNotification", (req, res) => {
    //set up variables from the request body
    let actionId = req.body.actionId;
    db.query(DELETE_NOTIFICATION_BY_ACTION_ID, actionId, (err) => {
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

router.post("/clearNotifications", (req, res) => {
    //set up variables from the request body
    let user = req.body.user;
    db.query(DELETE_SEEN_NOTIFICATIONS, [user, true], (err) => {
        // if error
        if (err) {
            // respond with error status and error message
            console.log(err);
            res.status(500).send(err.message);

            return;
        }
        // respond with success message on success
        res.json("success");
    });
});

router.post("/setNotificationAsSeen", (req, res) => {
    //set up variables from the request body
    let { actionId } = req.body;
    // set the userAction as seen in the userActions table found by actionId from the request
    db.query(SET_NOTIFICATION_AS_SEEN_BY_ACTION_ID, actionId, (err) => {
        // if error
        if (err) {
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        // respond with success message on completion
        res.json("success");
    });
});

//#endregion ENDPOINTS

module.exports = router;
