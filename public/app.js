
const socket = io();

let currentUser = "";

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

// 💬 MESAJ GÖNDER
function sendMessage() {

    const input = document.getElementById("messageInput");

    if (input.value.trim() === "") return;

    socket.emit("message", {
        user: currentUser,
        text: input.value
    });

    input.value = "";
}

// 📥 MESAJ AL
socket.on("message", (msg) => {

    const li = document.createElement("li");

    li.textContent = msg.user + ": " + msg.text;

    document.getElementById("messages").appendChild(li);
});

// ⌨ ENTER İLE GÖNDER
document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        const input = document.getElementById("messageInput");

        if (document.activeElement === input) {
            sendMessage();
        }
    }
});