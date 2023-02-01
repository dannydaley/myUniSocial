var express = require("express");
var express = require("express");
var router = express.Router();
const db = require("../config/database");

const GET_ALL_USERS_FRIENDS =
    "SELECT * FROM friendships WHERE user1 =? OR user2 = ?";

router.post("/getFeedFriendsOnly", (req, res) => {
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

module.exports = router;