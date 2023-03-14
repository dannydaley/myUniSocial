#myUniSocial#

myUniSocial is a service for universities to assist in the social and learning aspects of university life. The platform has space for tools to aid students on their journey.

###Features###

##Front-End##
####Installed Dependecies####

-   "@emotion/react": "^11.7.1",
-   "@emotion/styled": "^11.6.0",
-   "@fontsource/roboto": "^4.5.3",
-   "@material-ui/core": "^4.12.3",
-   "@material-ui/icons": "^4.11.2",
-   "@mui/icons-material": "^5.4.2",
-   "@mui/lab": "^5.0.0-alpha.69",
-   "@mui/material": "^5.4.2",
-   "@mui/styled-engine-sc": "^5.4.2",
-   "@reduxjs/toolkit": "^1.8.0",
-   "@testing-library/jest-dom": "^5.16.1",
-   "@testing-library/react": "^12.1.2",
-   "@testing-library/user-event": "^13.5.0",
-   "axios": "^0.26.1",
-   "body-parser": "^1.19.2",
-   "crypto-browserify": "^3.12.0",
-   "dotenv": "^16.0.0",
-   "react": "^17.0.2",
-   "react-document-meta": "^3.0.0-beta.2",
-   "react-dom": "^17.0.2",
-   "react-redux": "^7.2.6",
-   "react-router-dom": "^6.2.2",
-   "react-scripts": "5.0.0",
-   "react-scroll-to-bottom": "^4.2.0",
-   "react-syntax-highlighter": "^15.5.0",
-   "socket.io-client": "^4.6.0",
-   "styled-components": "^5.3.3",
-   "uninstall": "0.0.0",
-   "web-vitals": "^2.1.4"

##Back-End##

####Installed Dependecies####

-   "body-parser": "^1.19.2",
-   "cookie-parser": "^1.4.6",
-   "cookie-session": "^2.0.0",
-   "cors": "^2.8.5",
-   "crypto": "^1.0.1",
-   "dotenv": "^15.0.0",
-   "express": "^4.17.2",
-   "express-history-api-fallback": "^2.2.1",
-   "express-session": "^1.17.3",
-   "http": "^0.0.1-security",
-   "multer": "^1.4.4",
-   "mysql": "^2.18.1",
-   "nodemailer": "^6.9.1",
-   "nodemon": "^2.0.15",
-   "path": "^0.12.7",
-   "randomstring": "^1.2.3",
-   "socket.io": "^4.6.0",
-   "sqlite3": "^5.1.4",
-   "uuid": "^3.4.0"
    ###Database###

###Database table setup###

###Table Structure###

####Table: users####

| id  | firstName | lastName | username      | email                | password   | passwordSalt     | aboutMe                   |
| --- | --------- | -------- | ------------- | -------------------- | ---------- | ---------------- | ------------------------- |
| 1   | Danny     | Daley    | dannydaley123 | dannydaley@email.com | myPassword | mYhAsHeDpAsSwOrD | This is my about me text! |

| profilePicture     | course          | year | location | education  | circles          | asked | answered |
| ------------------ | --------------- | ---- | -------- | ---------- | ---------------- | ----- | -------- |
| images/profPic.png | Web Development | 3    | Falmouth | Falmouth U | COMP110, COMP120 | 10    | 20       |

####Table: posts####
"id": 6,
"firstName": "Robbie",
"lastName": "George",
"username": "yojivia",
"email": "robbie.george12@icloud.com",
"password": "e251dc4f858e3c10d206d4e0f44f78fc277c90ba93a78121080920fbd91cfbf6b06c82f9d319bfef1966c338b85af28ebad091bd352d38a829f5958bbfe35ed1",
"passwordSalt": "cc2e98234412fddc17991551693fabb24b3bad9cb1fe0ec0b6547877c5c52af95fafe6fa2452e630a8f120be34f5f1d0213cc77f9d56973954a7afcdec1b871fd3bcc53dd4be63999da1457a03971972b6d153f2f75b78385d0b24bd9e0f52c65311ef64abd562f365a93211cb25de35a2951ebe724e0453dae2768d2c70b1fa21c1848d70a2edb9668fe72c544dec68c9b9f0c0d12ba85016ea16c58992ffa7d44db328d7904c72f76e3f33bfd743a3f30276b8e758a93200260f668e127d368ba03075c6f40182cc566c3cf6f95269c9dd6c0bb86536b01ce4154f78d215ba95d796678b70b023f86ab4d51b7224c2f2836cb8d31a62795f438e7f4f9a074f",
"aboutMe": "Hi, Im Robbie George and I am a teacher from the UK, living in Sweden",
"course": "Web Development",
"year": 3,
"location": "Huddinge, Sweden",
"education": "Falmouth University",
"work": "A school in Sweden",
"profilePicture": "images/uploads/defaultUser.png",
"coverPicture": "",
"circles": "",
"asked": 1,
"answered": 0
####Table: questions####

####Table: friendships ####

####Table: userActions####
####Table: images####
####Table: messages####
####Table: chats####
####Table: circles####

###Testing the project###
Jest is a JavaScript test runner that lets you access the DOM via jsdom. While jsdom is only an approximation of how the browser works, it is usually good enough for testing React components. Jest provides a great iteration speed combined with powerful features like mocking modules and timers so you can have more control over how the code executes
###Running the project###
