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

let images = []; 
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
    let u = loginUser.value;
    let p = loginPass.value;

    if (!users[u] || users[u].pass !== p) {
        alert("Wrong username or password!");
        return;
    }

    if (users[u].banned) {
        show("banned-page");
        banMsg.innerHTML = `You are banned.<br>Reason: <b>${users[u].reason}</b>`;
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
    let u = createUser.value;
    let p = createPass.value;

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

/* ==========================================
                LOBBY (FIXED)
========================================== */

function openLobby() {
    show("lobby");
    topUsername.innerText = currentUser;

    adminPanel.classList.toggle("hidden", currentUser !== "boy");
}

/* ==========================================
                LOGOUT
========================================== */

function logout() {
    currentUser = null;
    show("login-page");
}

/* ==========================================
                ADMIN PANEL
========================================== */

function banUser() {
    let u = banUserInput.value;
    let r = banReason.value;

    if (!users[u]) return alert("User not found!");

    users[u].banned = true;
    users[u].reason = r || "No reason";

    alert("User banned.");
}

function unbanUser() {
    let u = unbanUserInput.value;

    if (!users[u]) return alert("User not found!");

    users[u].banned = false;
    users[u].reason = "";

    alert("User unbanned.");
}

/* ==========================================
              SEARCH FIX (NO DELETE)
========================================== */

function searchImage() {
    let q = searchBox.value.toLowerCase().trim();
    let container = results;
    container.innerHTML = "";

    let filtered = q === "" ? images : images.filter(img => img.title.toLowerCase().includes(q));

    if (filtered.length === 0) {
        container.innerHTML = "<p>No images found.</p>";
        return;
    }

    filtered.forEach(img => {
        container.innerHTML += `
            <div class="image-card">
                <h3 onclick="editTitle(this, '${img.id}')">${img.title}</h3>
                <p>By: <b>${img.owner}</b></p>
                <img src="${img.url}">
                <button onclick="deleteImage('${img.id}')">Delete</button>
            </div>
        `;
    });
}

/* ==========================================
        UPLOAD — DRAG & DROP (FIXED)
========================================== */

dropZone.addEventListener("dragover", e => e.preventDefault());

dropZone.addEventListener("drop", e => {
    e.preventDefault();

    if (currentUser === "guest") {
        alert("Guest cannot upload!");
        return;
    }

    let file = e.dataTransfer.files[0];
    processImage(file);
});

/* ==========================================
        UPLOAD VIA INPUT (FIXED)
========================================== */

function uploadFromInput() {
    let file = fileInput.files[0];
    processImage(file);
}

/* ==========================================
              IMAGE PROCESS
========================================== */

function processImage(file) {
    if (!file) return;

    let reader = new FileReader();

    reader.onload = () => {
        preview.src = reader.result;
        preview.classList.remove("hidden");

        let id = "img_" + Date.now();

        images.push({
            id,
            title: "New Image",
            url: reader.result,
            owner: currentUser
        });

        searchImage();
        openProfile();
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
    openProfile();
}

/* ==========================================
             EDIT TITLE INLINE
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
            let img = images.find(i => i.id === id);
            img.title = input.value;

            input.replaceWith(el);
            el.innerText = input.value;

            openProfile();
            searchImage();
        }
    });
}

/* ==========================================
              PROFILE PAGE FIX
========================================== */

function openProfile() {
    if (currentUser === "guest") return alert("Guest has no profile!");

    show("profile-page");

    let u = users[currentUser];

    profileName.innerText = currentUser;
    profileJoined.innerText = "Joined: " + u.joined;
    profileAvatar.src = u.avatar;

    let userImages = images.filter(img => img.owner === currentUser);
    profileUploads.innerText = "Total uploads: " + userImages.length;

    profileGallery.innerHTML = "";

    userImages.forEach(img => {
        profileGallery.innerHTML += `
            <div>
                <img src="${img.url}">
                <p onclick="editTitle(this, '${img.id}')">${img.title}</p>
                <button onclick="deleteImage('${img.id}')">Delete</button>
            </div>
        `;
    });
}
