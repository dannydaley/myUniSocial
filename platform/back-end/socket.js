// socket.js
const { Server } = require("socket.io");

// const db = require("./config/database");

const socket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    const users = {};
    io.origins(
        "https://myunisocial.kemeneth.net www.myunisocial.kemeneth.net http://192.168.168.6:3000 http://localhost:3000 http://dd252935.kemeneth.net:9030 http://myunisocial.kemeneth.net 127.0.0.1:9030 https://127.0.0.1:9030 https://dd252935.kemeneth.net:9030 https://myunisocial.kemeneth.net"
    );
    //On connection
    io.on("connection", (socket) => {
        io.setMaxListeners(0);
        socket.on("join", function (data) {
            socket.join(data.username); // We are using room of socket io

            // COMMENTS LEFT HERE FOR REFERENCE WHEN DOING "ONLINE FRIENDS"

            // console.log(data.username + " has joined with ID: " + socket.id);

            // users[socket.id] = data.username;
            // console.log(users);
        });

        socket.on("join_room", (room) => {
            socket.join(room);

            console.log("joined room: " + room);
        });
        socket.on("leave_room", (room) => {
            socket.leave(room);
            console.log("leaving room: " + room);
        });
        //On message send
        socket.on("send_message", (data) => {
            //Log message
            console.log(data);
            //Emit to recipient
            socket.to(data.room).emit("receive_message", data);
        });

        //On disconnect
        socket.on("disconnect", () => {
            //Log user ids
            // users - socket.id;
            // console.log(users);
            // console.log(`user disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = socket;
