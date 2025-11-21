// Database fake
let users = {
    "boy": { pass: "123boyhi", banned: false, reason: "" },
    "admin": { pass: "admin123", banned: false, reason: "" }
};

let current = null;

function showLogin() {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById("login-page").classList.remove("hidden");
}

function showCreate() {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById("create-page").classList.remove("hidden");
}

function guest() {
    current = "guest";
    openLobby();
}

function login() {
    let u = document.getElementById("login-user").value;
    let p = document.getElementById("login-pass").value;

    if (!users[u] || users[u].pass !== p) {
        alert("Wrong login!");
        return;
    }

    if (users[u].banned) {
        document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
        document.getElementById("banned-page").classList.remove("hidden");
        document.getElementById("ban-msg").innerText = "Reason: " + users[u].reason;
        return;
    }

    current = u;
    openLobby();
}

function createAccount() {
    let u = document.getElementById("create-user").value;
    let p = document.getElementById("create-pass").value;

    if (users[u]) {
        alert("Username already exists!");
        return;
    }

    users[u] = { pass: p, banned: false, reason: "" };
    alert("Account created!");
    showLogin();
}

function openLobby() {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById("lobby").classList.remove("hidden");

    if (current === "admin") {
        document.getElementById("admin-panel").classList.remove("hidden");
    }
}

function banUser() {
    let u = document.getElementById("ban-user").value;
    let r = document.getElementById("ban-reason").value;

    if (!users[u]) return alert("User not found.");

    users[u].banned = true;
    users[u].reason = r;

    alert(u + " has been banned.");
}

function searchImage() {
    let q = document.getElementById("search-box").value;
    document.getElementById("results").innerHTML =
        `<img src="https://source.unsplash.com/400x300/?${q}">`;
}

// Drag drop upload
let drop = document.getElementById("drop-zone");

drop.addEventListener("dragover", (e) => e.preventDefault());
drop.addEventListener("drop", (e) => {
    e.preventDefault();

    let file = e.dataTransfer.files[0];
    let reader = new FileReader();

    reader.onload = () => {
        let img = document.getElementById("preview");
        img.src = reader.result;
        img.classList.remove("hidden");
    };

    reader.readAsDataURL(file);
});
