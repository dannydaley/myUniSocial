var express = require("express");
var express = require("express");
var router = express.Router();
const db = require("../config/database");
const { passwordHash, generatePepper } = require("../security");
var randomstring = require("randomstring");

//#region SIGN UP & SIGN IN

const FIND_USER = "SELECT * FROM users WHERE email = ?";
const SIGN_UP_USER =
    "INSERT INTO users (email, username, firstName, lastName, password, passwordSalt, aboutMe, course, year, profilePicture, asked, answered) VALUES(?,?,? ,?,?,? ,?,?,? ,?,?,?)";

router.post("/signUp", (req, res) => {
    //set up variables from the request for better readability
    let {
        signUpEmail,
        signUpUserName,
        signUpFirstName,
        signUpLastName,
        signUpPassword,
        confirmSignUpPassword,
    } = req.body;
    //if both password fields match
    if (signUpPassword === confirmSignUpPassword) {
        //generate salt to store
        let passwordSalt = generatePepper;
        //generate password to store, using password from the confirm field, and the generated salt
        let storePassword = passwordHash(confirmSignUpPassword, passwordSalt);
        //assign default profile picture
        let profilePicture = "images/defaultUser.png";
        //Create a new user in the user database with the fields from the form, the default profile picture and the generated password hash and salt
        let aboutMe = "I haven't added an about me yet!";
        let course = "I haven't added my course yet!";
        let year = 1;
        let asked = 0;
        let answered = 0;

        db.query(
            SIGN_UP_USER,
            [
                signUpEmail,
                signUpUserName,
                signUpFirstName,
                signUpLastName,
                storePassword,
                passwordSalt,
                aboutMe,
                course,
                year,
                profilePicture,
                asked,
                answered,
            ],
            (err, rows) => {
                if (err) {
                    console.log("failed to add user to database");
                    console.log(err);
                    // if username already exists in database
                    if (
                        err.message ===
                        "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username"
                    ) {
                        console.log("USERNAME ALREADY EXISTS");
                        res.json("duplicate username");
                        return;
                    }
                    // if email already exists in database
                    if (
                        err.message ===
                        "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email"
                    ) {
                        console.log("EMAIL ALREADY EXISTS");
                        res.json("duplicate email");
                        return;
                    }
                    // if any other error case, respond with status and error message
                    res.status(500).send(err.message);
                    return;
                }
                //respond with success
                res.json("sign up success");
            }
        );
        //response if password fields dont match
    } else {
        res.json("PASSWORDS DONT MATCH");
    }
});

router.post("/signin", (req, res) => {
    // pull data from request body for better readbility
    let { email, password } = req.body;
    // search if user exists using email address
    db.query(FIND_USER, email, (err, userData) => {
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
            // create empty session data to be populated
            req.session.userData = {};
            req.session.key = user.username + randomstring.generate();
            // apply user data to session variables
            req.session.userData.isSignedIn = true;
            req.session.userData.userFirstName = user.firstName;
            req.session.userData.userLastName = user.lastName;
            req.session.userData.loggedInUsername = user.username;
            req.session.userData.userProfilePicture = user.profilePicture;
            req.session.userData.userCoverPicture = user.coverPicture;

            //respond with user data on succesful login
            res.json({
                status: "success",
                isSignedIn: req.session.userData.isSignedIn,
                firstName: req.session.userData.userFirstName,
                lastName: req.session.userData.userLastName,
                username: req.session.userData.loggedInUsername,
                profilePicture: req.session.userData.userProfilePicture,
                coverPicture: req.session.userData.userCoverPicture,
            });
            // otherwise, credentials are invalid
        } else {
            //respond with failure message
            res.json({
                status: "failed",
                message: "incorrect email or password",
            });
        }
    });
});

router.post("/signout", (req, res) => {
    // delete session
    req.session = null;
    // respond with success
    res.json("success");
});

router.post("/refreshSessionStatus", (req, res) => {
    // if userData exists in session
    if (req.session.userData !== undefined) {
        // respond with session exists status and session data
        res.json({
            status: "session-exists",
            isSignedIn: req.session.userData.isSignedIn,
            firstName: req.session.userData.userFirstName,
            lastName: req.session.userData.userLastName,
            username: req.session.userData.loggedInUsername,
            profilePicture: req.session.userData.userProfilePicture,
        });
    } else {
        // respond with no session if no session data found
        res.json("no session");
    }
});

module.exports = router;
