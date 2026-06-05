
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = {};      // socket.id -> username
const friends = {};    // username -> friends list

io.on("connection", (socket) => {

    // 👤 kullanıcı kayıt
    socket.on("register", (username) => {

        users[socket.id] = username;

        if (!friends[username]) {
            friends[username] = [];
        }

        socket.emit("friend-list", friends[username]);
    });

    // ➕ arkadaş ekleme
    socket.on("add-friend", (friendName) => {

        const user = users[socket.id];

        if (!user) return;

        if (!friends[user]) {
            friends[user] = [];
        }

        if (!friends[user].includes(friendName)) {
            friends[user].push(friendName);
        }

        socket.emit("friend-list", friends[user]);
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log("DISCA çalışıyor 🚀");
});