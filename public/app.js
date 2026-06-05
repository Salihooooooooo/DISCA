
let currentUser = "";
let currentChannel = "genel";

// 🔐 LOGIN
function login() {

    const username = document.getElementById("username").value;

    if (username.trim() === "") {
        alert("Kullanıcı adı gir!");
        return;
    }

    currentUser = username;

    document.getElementById("loginScreen").style.display = "none";
    document.querySelector(".app").style.display = "flex";
}

// 📝 REGISTER (şimdilik demo)
function register() {
    alert("Kaydol sistemi yakında 😎");
}

// 📡 SOCKET BAĞLANTISI
const socket = io();

// 💬 MESAJ GÖNDER
function sendMessage() {

    const input = document.getElementById("messageInput");

    if (input.value.trim() === "") return;

    const message = currentUser + ": " + input.value;

    socket.emit("message", message);

    input.value = "";
}

// 📥 MESAJ AL
socket.on("message", (msg) => {

    const li = document.createElement("li");
    li.textContent = msg;

    document.getElementById("messages").appendChild(li);

});

// 📌 KANAL DEĞİŞTİR
function switchChannel(channel) {

    currentChannel = channel;

    document.getElementById("chatHeader").textContent = "#" + channel;

}

// 🎧 SESLİ ODAYA GİR (BASİT BAŞLANGIÇ)
let localStream;
let peerConnections = {};

// 🎧 VOICE BAŞLAT
function joinVoice() {

    socket.emit("join-room", currentChannel);

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {

        localStream = stream;

        console.log("🎧 Mikrofon açıldı");

        createVoiceConnection(stream);

    })
    .catch(err => {
        alert("Mikrofon izni ver!");
    });
}

// 🔊 VOICE CONNECTION
function createVoiceConnection(stream) {

    const peer = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    });

    stream.getTracks().forEach(track => {
        peer.addTrack(track, stream);
    });

    peer.ontrack = (event) => {

        const audio = document.createElement("audio");
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        document.body.appendChild(audio);

    };

    peer.onicecandidate = (event) => {

        if (event.candidate) {
            socket.emit("signal", {
                room: currentChannel,
                signal: event.candidate
            });
        }

    };

    peer.createOffer().then(offer => {
        peer.setLocalDescription(offer);

        socket.emit("signal", {
            room: currentChannel,
            signal: offer
        });
    });

}

// 🔊 SIGNAL GELİNCE
socket.on("signal", async (data) => {

    if (!data.signal) return;

    const peer = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    });

    peer.ontrack = (event) => {

        const audio = document.createElement("audio");
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        document.body.appendChild(audio);

    };

    await peer.setRemoteDescription(new RTCSessionDescription(data.signal));

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("signal", {
        room: currentChannel,
        signal: peer.localDescription
    });

});