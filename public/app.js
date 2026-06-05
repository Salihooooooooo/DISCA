
let currentUser = "";

const socket = io();

// 🔐 login sonrası register
function login() {

    const username = document.getElementById("username").value;

    if (username.trim() === "") {
        alert("Kullanıcı adı gir!");
        return;
    }

    currentUser = username;

    document.getElementById("loginScreen").style.display = "none";
    document.querySelector(".app").style.display = "flex";

    socket.emit("register", currentUser);
}

// ➕ arkadaş ekle
function addFriend() {

    const name = prompt("Arkadaş kullanıcı adı:");

    if (name && name.trim() !== "") {
        socket.emit("add-friend", name);
    }
}

// 📥 arkadaş listesi güncelle
socket.on("friend-list", (list) => {

    const box = document.getElementById("friendList");

    if (!box) return;

    box.innerHTML = "";

    list.forEach(friend => {

        const div = document.createElement("div");
        div.textContent = "👤 " + friend;

        box.appendChild(div);
    });
});