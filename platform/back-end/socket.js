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

    //On connection
    io.on("connection", (socket) => {
        //On message button click
        //         db.query(
        //             "SELECT * FROM userActions WHERE sender = ? OR recipient = ? AND seen = `false`",
        //             ["Daley", "Daley"],
        //             (err, result) => {
        //                 console.log(result);
        //             }
        //         );
        console.log(socket.id);
        socket.on("select_recipient", (data) => {
            //Assign and log recipient
            socket.join(data);
        });

        //On message send
        socket.on("send_message", (data) => {
            //Log message
            console.log(data);
            //Emit to recipient
            socket.to(data.recipient).emit("receive_message", data);
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
