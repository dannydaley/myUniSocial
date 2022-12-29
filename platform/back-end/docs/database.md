# SQL DATABASE

My preferred choice for a storage solution. As the SQL database allows for multiple tables within a single space
and holds data continuously between server restarts, so it felt like a good fit for the main storage solution for my platform.
The added benefit of being able to use the tables relationally was another great plus and is functionality that is used throughout

SQLite3 database set up in server.js under the variable **SQLdatabase**, table setup is performed from the endpoints:

### **users table** - /usersSetup
### **posts table** - /postsSetup
### **friendships table** - /friendshipsSetup
### **images table** - /imagesSetup
### **userActions table** - /userActionsSetup
### **chats table** - /chatsSetup
### **messages table** - /messagesSetup

### **FILE: "SQLdatabase"**
----
## TABLE: users

### **FIELDS & DATA TYPES:**
#### |`id` INTEGER, PRIMARY KEY, AUTOINCREMENTS|
#### |`username` VARCHAR(255) , UNIQUE|
#### |`firstName` VARCHAR(255)|
#### |`lastName` VARCHAR(255)|
#### |`email` VARCHAR(255), UNIQUE|
#### |`password` VARCHAR(255)|
#### |`passwordSalt` VARCHAR(512)|
#### |`aboutMe` VARCHAR(255)|
#### |`location` VARCHAR(255)|
#### |`education` VARCHAR(255)|
#### |`work` VARCHAR(255)|
#### |`profilePicture` VARCHAR(255)|
#### |`coverPicture` VARCHAR(255)|

----

### TABLE: posts

**FIELDS & DATA TYPES:**
#### |`id` INTEGER, PRIMARY KEY, AUTOINCREMENTS|
#### |`author` VARCHAR(255)|
#### |`content` TEXT|
#### |`date` VARCHAR(255)|
#### |`circle` VARCHAR(255)|
#### |`recipient` VARCHAR(255)|
#### |`likes` INT|
#### |`dislikes` INT|
#### |`postStrict` INT|

----

### TABLE: friendships

**FIELDS & DATA TYPES:**
#### |`user1` VARCHAR(255)|
#### |`user2` VARCHAR(255)|

----

### TABLE: images

**FIELDS & DATA TYPES:**
#### |`ownerUsername` VARCHAR(255)|
#### |`imageLocation` VARCHAR(255)|
#### |`postId` INT|

----

### TABLE: userActions

**FIELDS & DATA TYPES:**
#### |`actionId` INT|
#### |`type` VARCHAR(255)|
#### |`sender` VARCHAR(255)|
#### |`recipient` VARCHAR(255)|
#### |`message` VARCHAR(255)|
#### |`seen` INT|
#### |`approved` INT|
#### |`date` VARCHAR(255)|
#### |`relativePost` VARCHAR(255)|

----

### TABLE: chats

**FIELDS & DATA TYPES:**
#### |`chatId` INT|
#### |`user1` VARCHAR(255)|
#### |`user2` VARCHAR(255)|
#### |`seenByUser1` INT|
#### |`SeenByUser2` INT|
#### |`lastActive"` VARCHAR(255)|

----

### TABLE: messages

**FIELDS & DATA TYPES:**
#### |`chatId` INT|
#### |`messageId` INT|
#### |`sender` VARCHAR(255)|
#### |`recipient` VARCHAR(255)|
#### |`message` TEXT|
#### |`date` VARCHAR(255)|
#### |`seen` INT|

----

### TABLE: circles

**FIELDS & DATA TYPES:**
#### |`circleName` VARCHAR(255)|
#### |`users` INT|

----