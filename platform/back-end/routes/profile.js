var express = require("express");
const { request } = require("express");

var express = require("express");
var router = express.Router();
const db = require("../config/database");

const CHECK_THAT_USERS_ARE_FRIENDS =
    "SELECT * FROM friendships WHERE (user1 = ? OR user2 = ?) AND (user1 = ? OR user2 = ?)";
const GET_USER_PROFILE_INFO_BY_USERNAME =
    "SELECT firstName, lastName, aboutMe, profilePicture, coverPicture FROM users WHERE username = ?";

const GET_ALL_IMAGES_BY_USER =
    "SELECT * FROM images WHERE ownerUsername = ? ORDER BY postId DESC";
const GET_POSTS_BY_AUTHOR_OR_RECIPIENT =
    "SELECT posts.*, users.firstName, users.lastName, users.profilePicture FROM `posts` LEFT OUTER JOIN `users` ON `posts`.`author` = `users`.`username` WHERE author = ? OR recipient = ? ORDER BY id DESC";
const GET_POSTS_BY_AUTHOR_BY_CIRCLE =
    "SELECT * FROM `posts` WHERE author = ? AND circle = ? ORDER BY id DESC";

//#region PROFILE DATA

router.post("/getUserProfile", (req, res) => {
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
            let friendRequestSent;
            let requestSender;
            if (isFriendsWithLoggedInUser === false) {
                db.query(
                    "SELECT * FROM userActions WHERE (sender = ? AND recipient = ? AND type = ?) OR (sender = ? AND recipient = ? AND type = ?)",
                    [
                        loggedInUsername,
                        userProfileToGet,
                        "friendRequest",
                        userProfileToGet,
                        loggedInUsername,
                        "friendRequest",
                    ],
                    (err, rows) => {
                        // if error
                        if (err) {
                            // respond with error status and error message
                            console.log(err.message);
                            return;
                        }
                        // respond with success on success
                        if (rows.length > 0) {
                            friendRequestSent = true;
                            requestSender = rows[0].sender;
                        }
                    }
                );
            }
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
                        friendRequestSent: friendRequestSent,
                        sender: requestSender,
                    });
                }
            );
        }
    );
});

router.post("/getAllImagesByUser", (req, res, next) => {
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

module.exports = router;
