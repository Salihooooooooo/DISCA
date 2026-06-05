const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

// 💬 CHAT + 🎧 VOICE SIGNAL SERVER
io.on("connection", (socket) => {

    console.log("Kullanıcı bağlandı:", socket.id);

    // 💬 MESAJLAR
    socket.on("message", (msg) => {
        io.emit("message", msg);
    });

    // 🎧 ODAYA KATILMA
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(socket.id, "odaya girdi:", room);
    });

    // 🔊 WEBRTC SIGNAL (SES VERİSİ DEĞİL, BAĞLANTI VERİSİ)
    socket.on("signal", (data) => {
        // data: { room, signal }
        socket.to(data.room).emit("signal", {
            signal: data.signal,
            from: socket.id
        });
    });

    socket.on("disconnect", () => {
        console.log("Kullanıcı çıktı:", socket.id);
    });

});

// 🚀 SERVER BAŞLAT
http.listen(3000, () => {
    console.log("DISCA çalışıyor 🚀");
});