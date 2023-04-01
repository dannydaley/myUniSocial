# myUniSocial

myUniSocial is a service for universities to assist in the social and learning aspects of university life. The platform has space for tools to aid students on their journey.

The platform can be seen and used at the following URL: https://myunisocial.kemeneth.net

## Features

### myUni404

-   View question feed
-   Search for question and get relevant hits
-   View questions and answers
-   write questions
-   Write answers
-   Vote answers up or down
-   Answeres with higher votes are listed above those with less
-   Multiple categorys/feeds of questions by field
-   User profiles
-   view users asked questions
-   view users answers
-   asked/answered count
-   Profile picture and about me updates

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

## Database table setup

### Table Structure

#### Table: users

| id  | firstName | lastName | username      | email                | password   | passwordSalt     | aboutMe                   | profilePicture     | course          | year | location | education  | circles          | asked | answered |
| --- | --------- | -------- | ------------- | -------------------- | ---------- | ---------------- | ------------------------- | ------------------ | --------------- | ---- | -------- | ---------- | ---------------- | ----- | -------- |
| 1   | Danny     | Daley    | dannydaley123 | dannydaley@email.com | myPassword | mYhAsHeDpAsSwOrD | This is my about me text! | images/profPic.png | Web Development | 3    | Falmouth | Falmouth U | COMP110, COMP120 | 10    | 20       |

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

### Running the project

#### Running the project in VS Code

With the repository cloned, open the "platform" directory in VS Code.

In the topmost menu (where 'File' and 'Edit' usually are), select 'Terminal' => 'New Terminal'.

Using the terminal navigate to the back-end directory with the following command.
`cd back-end`

Install the server dependencies.
`npm install`

Once the dependencies are installed, run the server in one of two modes.
To just start the server run:
`npm start`

Or to run the server in development mode, run:
`npm run dev`

With the server now running, press the 'Split Terminal' in the menu just above the terminal, or in the topmost menu 'Terminal' => 'Split Terminal'.

Using the new terminal navigate to the front-end directory with the following command. Note that it may start us in the back-end directory.
`cd ../front-end`

Ensure dependencies are installed.
`npm install`

With dependencies installed, start the front end in a development server.
`npm start`

The front end application will now be running on http://localhost:3000 .

#### Running the project in a Ubuntu terminal environment

Opening a terminal in the front end directory in the platform directory.

If using a terminal already, navigate to the directory with the following command.
`cd myUniSocial/platform/front-end`

Ensure dependencies are installed.
`npm install`

With dependencies installed, start the front end in a development server.
`npm start`

The front end application will now be running on http://localhost:3000 .

In a seperate terminal, navigate to the back-end directory.
`cd myUniSocial/platform/back-end`

**IMPORTANT** Rename the .env.example to .env

Ensure dependencies are installed.
`npm install`

Once the dependencies are installed, run the server in one of two modes.
To just start the server run:
`npm start`

Or to run the server in development mode, run:
`npm run dev`

The server will now be running on http://localhost:3001 .

Note: the project will require a MySQL server to operate, see the MySQL documentation at:
https://dev.mysql.com/doc/mysql-getting-started/en/

**Make sure to use the credentials defined in the .env**

With the database set up correctly, run this url in a browser to populate the database with dummy data:
http://localhost:3001/setup/dummyTablesSetup

### Testing the project

#### Front end unit tests

Navigate to front-end directory using the following command in a terminal:
`cd platform/front-end`

Run the unit tests with the following command:
`npm run test`

#### Server endpoint stress testing

**_This test will require the MySQL database to be set up with the dummy data provided._**

**You may need to install 'loadtest' to perform this test**
To install loadtest in a linux environment, run this command:
`npm install -g loadtest`
**More information on loadtest**: https://www.npmjs.com/package/loadtest

Navigate to the back-end directory.
`cd platform/back-end`

Run the stress test:
`loadtest -n 10000 -c 10 --rps 200 --data '{ "email": "testuser@email.com", "password": "test123"}' -T 'application/x-www-form-urlencoded' -m POST http://localhost:3001/auth/signin`

Note: this stress test tests the login endpoint with test user credentials, running 10,000 requests, a concurrency of 10 at 200 requests per second.

#### Deploying the project

Only run a deployment from the 'main' branch, as environment variables are different for the purpose of testing, and to protect user data.
This branch has been modified to support pop-up style deployment.

To run the project in a local or remote deployment, I prefer to log in to the hosting solution (ideally ubuntu) via ssh.

Navigate to directory back-end directory
`cd /srv/students/dd252935/myUniSocial/platform/back-end`

Rename, or copy the .env.example to ".env" (omitting the quotes)
`cp .env.example .env`

Run docker-compose build, and start the docker image...
`docker-compose build && docker-compose up`

Rr alternatively, run the command and start a daemonised image to run in the background..
`docker-compose build && docker-compose up -d`

If restarting the project for whatever reason, be sure to do the necessary clean up.
`docker-compose down && docker-compose build && docker-compose up -d --remove-orphans`

Before anything will work, build and populate the database tables by going to the URL localhost:9030/setup/dummyTablesSetup

With the tables built user registration will work.
alternatively, you can log in as a test user with the credentials

Email : testuser@email.com
Password : test123
