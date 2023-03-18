# myUniSocial

myUniSocial is a service for universities to assist in the social and learning aspects of university life. The platform has space for tools to aid students on their journey.

### Features

## Front-End

#### Installed Dependecies

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

## Back-End

#### Installed Dependecies

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
    ###Database

### Database table setup

### Table Structure

#### Table: users

| id  | firstName | lastName | username      | email                | password   | passwordSalt     | aboutMe                   |
| --- | --------- | -------- | ------------- | -------------------- | ---------- | ---------------- | ------------------------- |
| 1   | Danny     | Daley    | dannydaley123 | dannydaley@email.com | myPassword | mYhAsHeDpAsSwOrD | This is my about me text! |

| profilePicture     | course          | year | location | education  | circles          | asked | answered |
| ------------------ | --------------- | ---- | -------- | ---------- | ---------------- | ----- | -------- |
| images/profPic.png | Web Development | 3    | Falmouth | Falmouth U | COMP110, COMP120 | 10    | 20       |

#### Table: posts

| id  | author          | content                         | date      | circle    | recipient | likes | dislikes | postStrict | relativePostId |
| --- | --------------- | ------------------------------- | --------- | --------- | --------- | ----- | -------- | ---------- | -------------- |
| 1   | "dannydaley123" | "This is the body of the post!" | 17-3-2023 | "COMP110" | "none"    | 1     | 0        | 0          | null           |

#### Table: questions

| postID | author        | authorID        | authorProfilePicture          | date        | category | score | relativePostID | title                    | text                          | code                          | language |
| ------ | ------------- | --------------- | ----------------------------- | ----------- | -------- | ----- | -------------- | ------------------------ | ----------------------------- | ----------------------------- | -------- |
| 4      | "Danny Daley" | "dannydaley123" | "images/dannydaley123picture" | "15-3-2023" | "Web"    | 1     | 0              | "Why isnt this working?" | "Why isnt this code working?" | "<\code>Code Snippet</\code>" | "HTML    |

#### Table: friendships

| user1           | user2         |
| --------------- | ------------- |
| "dannydaley123" | "newUser1234" |

#### Table: userActions

| actionId | type            | sender          | recipient     | message                     | seen  | approved | date        | relativePost |
| -------- | --------------- | --------------- | ------------- | --------------------------- | ----- | -------- | ----------- | ------------ |
| 0        | "freindRequest" | "dannydaley123" | "newUser1234" | " wants to be your friend!" | false | false    | "15-3-2023" | null         |

#### Table: images

| ownerUsername   | imageLocation                              | postId |
| --------------- | ------------------------------------------ | ------ |
| "dannydaley123" | images/uploads/dannydaley123-768732197.png | 20     |

#### Table: messages

| chatId | messageId | sender        | recipient       | message      | date        | seen  |
| ------ | --------- | ------------- | --------------- | ------------ | ----------- | ----- |
| 1      | 2         | "newUser1234" | "dannydaley123" | "Hey there!" | "16-3-2023" | false |

#### Table: chats

| chatId | user1         | user2           | seenByUser1 | seenByUser2 | lastActive |
| ------ | ------------- | --------------- | ----------- | ----------- | ---------- |
| 1      | "newUser1234" | "dannydaley123" | true        | false       | "time"     |

#### Table: circles

| circleName | users |
| ---------- | ----- |
| "COMP110"  | 0     |

### Testing the project

Jest is a JavaScript test runner that lets you access the DOM via jsdom. While jsdom is only an approximation of how the browser works, it is usually good enough for testing React components. Jest provides a great iteration speed combined with powerful features like mocking modules and timers so you can have more control over how the code executes

### Running the project
