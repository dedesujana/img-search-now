/* ==========================================
               DATABASE
========================================== */

let users = {
    "boy": {
        pass: "123boyhi",
        banned: false,
        reason: "",
        joined: new Date().toLocaleDateString(),
        avatar: "https://img.icons8.com/ios-glyphs/256/user-male-circle.png"
    }
};

let images = []; // semua gambar
let currentUser = null;

/* ==========================================
                 PAGE SWITCH
========================================== */

function show(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

/* ==========================================
                 LOGIN SYSTEM
========================================== */

function login() {
    let u = document.getElementById("login-user").value;
    let p = document.getElementById("login-pass").value;

    if (!users[u] || users[u].pass !== p) {
        alert("Wrong username or password!");
        return;
    }

    if (users[u].banned) {
        show("banned-page");
        document.getElementById("ban-msg").innerHTML =
            `You are banned.<br>Reason: <b>${users[u].reason}</b>`;
        return;
    }

    currentUser = u;
    openLobby();
}

function guest() {
    currentUser = "guest";
    openLobby();
}

/* ==========================================
             CREATE ACCOUNT
========================================== */

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

    users[u] = {
        pass: p,
        banned: false,
        reason: "",
        joined: new Date().toLocaleDateString(),
        avatar: "https://img.icons8.com/ios-glyphs/256/user-male-circle.png"
    };

    alert("Account created!");
    show("login-page");
}

function showCreate() { show("create-page"); }
function showLogin() { show("login-page"); }

/* ==========================================
                LOBBY
========================================== */

function openLobby() {
    show("lobby");

    document.getElementById("top-username").innerText = currentUser;

    if (currentUser === "boy") {
        document.getElementById("admin-panel").classList.remove("hidden");
    } else {
        document.getElementById("admin-panel").classList.add("hidden");
    }
}

function logout() {
    currentUser = null;
    show("login-page");
}

/* ==========================================
              ADMIN FUNCTIONS
========================================== */

function banUser() {
    let user = document.getElementById("ban-user").value;
    let reason = document.getElementById("ban-reason").value;

    if (!users[user]) {
        alert("User not found!");
        return;
    }

    users[user].banned = true;
    users[user].reason = reason || "No reason";

    alert(`User "${user}" has been banned.`);
}

function unbanUser() {
    let user = document.getElementById("unban-user").value;

    if (!users[user]) {
        alert("User not found!");
        return;
    }

    users[user].banned = false;
    users[user].reason = "";

    alert(`User "${user}" unbanned.`);
}

/* ==========================================
              SEARCH IMAGE
========================================== */

function searchImage() {
    let q = document.getElementById("search-box").value.toLowerCase();
    let container = document.getElementById("results");

    container.innerHTML = "";

    let filtered = images.filter(img =>
        img.title.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
        container.innerHTML = "<p>No images found.</p>";
        return;
    }

    filtered.forEach(img => {
        let el = document.createElement("div");

        el.innerHTML = `
            <h3 class="editable" onclick="editTitle(this, '${img.id}')">${img.title}</h3>
            <p>By: <b>${img.owner}</b></p>
            <img src="${img.url}">
            <button onclick="deleteImage('${img.id}')">Delete</button>
        `;

        container.appendChild(el);
    });
}

/* ==========================================
        UPLOAD IMAGE — DRAG & DROP
========================================== */

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
    processImage(file);
});

/* ==========================================
        UPLOAD IMAGE — FILE INPUT
========================================== */

function uploadFromInput() {
    let file = document.getElementById("file-input").files[0];
    processImage(file);
}

/* ==========================================
            PROCESS UPLOAD IMAGE
========================================== */

function processImage(file) {
    let reader = new FileReader();

    reader.onload = () => {
        preview.src = reader.result;
        preview.classList.remove("hidden");

        let id = "img_" + Date.now();

        images.push({
            id: id,
            title: "New Image",
            url: reader.result,
            owner: currentUser
        });

        alert("Image uploaded!");
    };

    reader.readAsDataURL(file);
}

/* ==========================================
           DELETE IMAGE
========================================== */

function deleteImage(id) {
    images = images.filter(img => img.id !== id);
    searchImage();
    openProfile(); // refresh gallery
}

/* ==========================================
            INLINE EDIT TITLE
========================================== */

function editTitle(el, id) {
    let old = el.innerText;

    let input = document.createElement("input");
    input.value = old;
    input.style.width = "80%";

    el.replaceWith(input);

    input.focus();

    input.addEventListener("keyup", e => {
        if (e.key === "Enter") {
            let newTitle = input.value;

            let img = images.find(i => i.id === id);
            img.title = newTitle;

            input.replaceWith(el);
            el.innerText = newTitle;

            openProfile();
            searchImage();
        }
    });
}

/* ==========================================
              PROFILE PAGE
========================================== */

function openProfile() {
    show("profile-page");

    let u = users[currentUser];

    document.getElementById("profile-name").innerText = currentUser;
    document.getElementById("profile-joined").innerText = "Joined: " + u.joined;
    document.getElementById("profile-avatar").src = u.avatar;

    let userImages = images.filter(img => img.owner === currentUser);

    document.getElementById("profile-uploads").innerText =
        "Total uploads: " + userImages.length;

    let gallery = document.getElementById("profile-gallery");
    gallery.innerHTML = "";

    userImages.forEach(img => {
        gallery.innerHTML += `
            <div>
                <img src="${img.url}">
                <p class="editable" onclick="editTitle(this, '${img.id}')">${img.title}</p>
                <button onclick="deleteImage('${img.id}')">Delete</button>
            </div>
        `;
    });
}

function openLobby() {
    show("lobby");
    document.getElementById("top-username").innerText = currentUser;
}
