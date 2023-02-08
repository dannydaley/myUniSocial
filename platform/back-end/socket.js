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

    var users = {
        user: "socketObject",
    };

    //On connection
    io.on("connection", (socket) => {
        // socket.on("connection", (socket) => {
        socket.on("join", function (data) {
            socket.join(data.username); // We are using room of socket io
            console.log(data.username + " has joined with ID: " + socket.id);
        });
        // });
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
        socket.on("disconnect_client", () => {
            //Log user ids
            console.log(`user disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = socket;
