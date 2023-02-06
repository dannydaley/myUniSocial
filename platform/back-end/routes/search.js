var express = require("express");
var router = express.Router();
const db = require("../config/database");

const SEARCH_TERM =
    "SELECT *  FROM questions WHERE title LIKE '%' || ? || '%' OR text LIKE ? || '%'";
router.post("/search-users", (req, res) => {
    //set up variables from the request body
    let searchQuery = req.body.search;
    // select firstname, lastname, profile picture and username from any users that part match our search query
    db.query(
        "SELECT `users`.`firstName`, `users`.`lastName`, `users`.`username`,`users`.`profilePicture` FROM `users` WHERE (CONCAT(users.firstName,' ',users.lastName) LIKE CONCAT('%',?,'%')) OR username LIKE CONCAT(?,'%')",
        [searchQuery, searchQuery],
        (err, results) => {
            // if error
            if (err) {
                console.log(err);
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

router.post("/search-questions", (req, res) => {
    //set up variables from the request body
    let searchQuery = req.body.search;
    // select firstname, lastname, profile picture and username from any users that part match our search query
    db.query(SEARCH_TERM, [searchQuery, searchQuery], (err, results) => {
        // if error
        if (err) {
            console.log(err);
            console.log(err.message);
            // respond with error status and error message
            res.status(500).send(err.message);
            return;
        }
        console.log(results);
        // respond with results on success
        res.json({
            status: "success",
            results: results,
        });
    });
});

module.exports = router;
