// socket.js
const { Server } = require("socket.io");

const socket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    const users = {};

    //On connection
    io.on("connection", (socket) => {
        io.setMaxListeners(0);
        socket.on("join", (data) => {
            socket.join(data.username); // We are using room of socket io
            // COMMENTS LEFT HERE FOR REFERENCE WHEN DOING "ONLINE FRIENDS"
            console.log(data.username + " has joined with ID: " + socket.id);
            // users[socket.id] = data.username;
            // console.log(users);
        });

        socket.on("join_room", (room) => {
            // join chat room
            socket.join(room);
        });
        socket.on("leave_room", (room) => {
            // leave chat room
            socket.leave(room);
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
