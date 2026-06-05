
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// 👇 gerçek zamanlı chat
io.on("connection", (socket) => {

    console.log("Kullanıcı bağlandı");

    // mesaj geldiğinde herkese gönder
    socket.on("message", (data) => {
        io.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log("Kullanıcı çıktı");
    });

});

server.listen(process.env.PORT || 3000, () => {
    console.log("DISCA çalışıyor 🚀");
});