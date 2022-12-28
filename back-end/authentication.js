//#region SECURITY STUFF 

// This stuff will be put into a .env file ( still to do )

// set up crypto middleware
let crypto = require('crypto');
const { captureRejectionSymbol } = require('events');

// number of iterations to jumble the hash
const iterations = 1000;

//set up char length of hash
const hashSize = 64;

// which hashing algorithm will be used
const hashAlgorithm = 'sha256';

// create a hash salt/pepper
const generatePepper = crypto.randomBytes(256).toString('hex');

//this function returns a hash of the password, combined with the pepper and the salt.
function passwordHash(thePassword, theSalt) {  
  const pepper = process.env.PEPPER;
   return crypto.pbkdf2Sync(thePassword, pepper + theSalt, iterations, hashSize, hashAlgorithm).toString('hex');
}

//adds new user to user database
router.post('/register', function (req, res, next) {
    let { email, username, password1, password2 } = req.body; 
    // if both password fields match..
    if (req.body.password1 === req.body.password2){    
      // generate a password salt 
      let generateSalt = crypto.randomBytes(256).toString('hex');
      // generate the password to store using confirmed password and the newly generated salt
      let storePassword = passwordHash(password2, generateSalt);  
      // initialise database
      let SQLdatabase = req.app.locals.SQLdatabase;
      // rename for easier access..
      let db = SQLdatabase;
      // store the data
      db.query('INSERT INTO `users` (name, email, password, passwordSalt, posts, joined, profilePicture, aboutMe, pinnedPost) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',[username, email, storePassword, generateSalt, 0, getDate(), "images/defaultUser.png", "", 0], function(err, result) {
        // error cases..
        if (err) {
          console.log(err.message);
          if (err.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.name") {
            res.render("registrationError", { cause: "username", loggedIn: changeNavLoginButton(sessionExists(req)) })
          }
          if (err.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email") {
            res.render("registrationError", { cause: "email", loggedIn: changeNavLoginButton(sessionExists(req)) })
          }
          else {
            res.status(500).send(err.message);
            return;
          }  
        }  
        // render on success
         res.render('user-db-done', {  title: "registered", loggedIn: changeNavLoginButton(sessionExists(req)) })     
      })
    }
});

  
//adds new user to user database
router.post('/changePassword', function (req, res, next) {
    let { currentPassword, newPassword1, newPassword2 } = req.body; 
    //get username of logged in user
    let SQLdatabase = req.app.locals.SQLdatabase;
    let username = req.session.userData.sessionUsername;
    let db = SQLdatabase;
    // set up command, select all from user database with THIS email
    const FIND_USER = "SELECT * FROM users WHERE name = ?"   
    // run the command with the email being passed in 
    db.query(FIND_USER, [username], (err, rows) => {  
      if (err) {  
        // if user not found respond with an error      
        found = false;
        res.status(500).send(err);               
      }     
      let user = rows[0]  
      /* if we get a user back, and the stored password matches the output of running the hashing
        function on what the user entered along with the stored password salt, set up the session
        variables and log the user in   */
        //check current password for auth
        if (user !== undefined && user.password === passwordHash(currentPassword, user.passwordSalt)){
          // if both password fields match
          if (newPassword1 === newPassword2)  {
            // set up the query
            let query = "UPDATE users SET password = ?, passwordSalt = ? WHERE name = ?"          
            // generate salt to be stored
            let generateSalt = crypto.randomBytes(256).toString('hex');
            // run the query
            db.query(query, [ passwordHash(newPassword2, generateSalt), generateSalt, req.session.userData.sessionUsername ], (err, rows) => {
              // error case
              if (err) {
                console.log(err)
              }
              // render on success
              res.render('user-db-done', {  title: "password changed", loggedIn: changeNavLoginButton(sessionExists(req)) })
            })
          }
          else {          
            console.log("new password and confirmation doesnt match")    
            res.render('changePassword', { title: 'Log in', loggedIn: changeNavLoginButton(sessionExists(req)) });
          }
      } else {          
        console.log("current password doesnt match")    
        res.render('changePassword', { title: 'Log in', loggedIn: changeNavLoginButton(sessionExists(req)) });
      }     
    })
})


  /* POST login data to validate login page */
router.post('/login', (req, res, next) => {
    //ready the data
    let data = req.body;
    // init database
    let SQLdatabase = req.app.locals.SQLdatabase;
    // rename for easier access
    let db = SQLdatabase;
    // set up command, select all from user database with THIS email
    const FIND_USER = "SELECT * FROM users WHERE email = ?"  
    // run the command with the email being passed in 
      db.query(FIND_USER, [data.email], (err, rows) => {  
        if (err) {  
          // if user not found respond with an error      
          found = false;
          res.status(500).send(err);               
        }
        let user = rows[0]
        /* if we get a user back, and the stored password matches the output of running the hashing
         function on what the user entered along with the stored password salt, set up the session
         variables and log the user in   */
          if (user !== undefined && user.password === passwordHash(data.password, user.passwordSalt)){
          //create the session data
          req.session.userData = {
          };
          // add user data to the session for referencing across the site 
          req.session.userData.sessionUsername = user.name;         
          req.session.userData.sessionUserPosts = user.posts;
          req.session.userData.sessionUserDateJoined = user.joined;
          req.session.userData.sessionUserProfilePicture = user.profilePicture;
          req.session.userData.sessionUserAboutMe = user.aboutMe;
          req.session.userData.sessionUserIsLoggedIn = true; 
          res.render('loggedIn', { name: req.session.userData.sessionUsername, posts: req.session.userData.sessionUserPosts, dateJoined: req.session.userData.sessionUserDateJoined, profilePicture: req.session.userData.sessionUserProfilePicture, title: 'You are logged in!', loggedIn: changeNavLoginButton(sessionExists(req)) });  
        }
        // otherwise invalid user or pass
        else {
          found = false;      
          res.render('failedLogin', { title: 'Log in', loggedIn: changeNavLoginButton(sessionExists(req)) });
        }       
      })   
})

//#endregion