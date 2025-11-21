/* ================================
            DATABASE
================================ */
let users = {
    "boy": { pass: "123boyhi", banned: false, reason: "" },  // ADMIN
};

let images = []; // semua gambar
let currentUser = null;

/* ================================
            PAGE SYSTEM
================================ */
function show(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

/* ================================
            LOGIN
================================ */
function login() {
    let user = document.getElementById("login-user").value;
    let pass = document.getElementById("login-pass").value;

    if (!users[user] || users[user].pass !== pass) {
        alert("Wrong username or password!");
        return;
    }

    if (users[user].banned) {
        show("banned-page");
        document.getElementById("ban-msg").innerHTML =
            `You are banned.<br>Reason: <b>${users[user].reason}</b>`;
        return;
    }

    currentUser = user;
    openLobby();
}

/* ================================
          CREATE ACCOUNT
================================ */
function createAccount() {
    let u = document.getElementById("create-user").value;
    let p = document.getElementById("create-pass").value;

    if (!u || !p) {
        alert("All fields required!");
        return;
    }

    if (users[u]) {
        alert("Username already exists!");
        return;
    }

    users[u] = { pass: p, banned: false, reason: "" };
    alert("Account created!");
    show("login-page");
}

function showCreate() { show("create-page"); }
function showLogin() { show("login-page"); }

/* ================================
            GUEST MODE
================================ */
function guest() {
    currentUser = "guest";
    openLobby();
}

/* ================================
            OPEN LOBBY
================================ */
function openLobby() {
    show("lobby");

    // ADMIN PANEL ONLY FOR "boy"
    if (currentUser === "boy") {
        document.getElementById("admin-panel").classList.remove("hidden");
    } else {
        document.getElementById("admin-panel").classList.add("hidden");
    }
}

/* ================================
            BAN USER
================================ */
function banUser() {
    let user = document.getElementById("ban-user").value;
    let reason = document.getElementById("ban-reason").value;

    if (!users[user]) {
        alert("User not found!");
        return;
    }

    if (!reason) reason = "No reason provided";

    users[user].banned = true;
    users[user].reason = reason;

    alert(`User "${user}" has been banned.`);
}

/* ================================
            SEARCH IMAGE
================================ */
function searchImage() {
    let q = document.getElementById("search-box").value;
    let container = document.getElementById("results");

    container.innerHTML = "";

    let filtered = images.filter(img =>
        img.title.toLowerCase().includes(q.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = "<p>No images found</p>";
        return;
    }

    filtered.forEach(img => {
        let el = document.createElement("div");
        el.innerHTML = `
            <h3>${img.title}</h3>
            <p>Uploaded by: <b>${img.owner}</b></p>
            <img src="${img.url}">
        `;
        container.appendChild(el);
    });
}

/* ================================
        DRAG & DROP UPLOAD
================================ */
let drop = document.getElementById("drop-zone");
let preview = document.getElementById("preview");

drop.addEventListener("dragover", (e) => e.preventDefault());

drop.addEventListener("drop", (e) => {
    e.preventDefault();

    if (currentUser === "guest") {
        alert("Guest cannot upload!");
        return;
    }

    let file = e.dataTransfer.files[0];
    let reader = new FileReader();

    reader.onload = () => {
        preview.src = reader.result;
        preview.classList.remove("hidden");

        images.push({
            title: "Uploaded Image",
            url: reader.result,
            owner: currentUser
        });

        alert("Image uploaded!");
    };

    reader.readAsDataURL(file);
});
