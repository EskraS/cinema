document.addEventListener("DOMContentLoaded", function () {
    const headerButtons = document.querySelectorAll(".header-button");
    if (headerButtons.length > 0) {
        headerButtons[0].classList.add('active');
    }

    headerButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            headerButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    const openLoginBtn = document.getElementById('open-login');
    const loginOverlay = document.getElementById('login-overlay');
    const closeLoginBtn = document.getElementById('close-login');
    const userMenuId = 'user-menu';
    let loggedIn = false;

    const userMenu = document.createElement('div');
    userMenu.id = userMenuId;
    userMenu.classList.add('dropdown-menu');
    userMenu.setAttribute('role', 'menu');
    userMenu.hidden = true;

    const viewProfileBtn = document.createElement('button');
    viewProfileBtn.textContent = 'View Profile';
    viewProfileBtn.classList.add('dropdown-item');
    viewProfileBtn.setAttribute('role', 'menuitem');

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.classList.add('dropdown-item');
    logoutBtn.setAttribute('role', 'menuitem');

    userMenu.appendChild(viewProfileBtn);
    userMenu.appendChild(logoutBtn);

    openLoginBtn.parentNode.insertBefore(userMenu, openLoginBtn.nextSibling);

    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
        loggedIn = true;
        openLoginBtn.innerHTML = '<span class="material-symbols-outlined">face_6</span>';
        openLoginBtn.classList.add('logged-in');
        openLoginBtn.setAttribute('aria-expanded', 'false');
        openLoginBtn.addEventListener('click', toggleUserMenu);
    } else {
        openLoginBtn.addEventListener('click', openLoginBtnClickHandler);
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            loginOverlay.style.display = 'none';
        });
        loginOverlay.addEventListener('click', (e) => {
            if (e.target === loginOverlay) {
                loginOverlay.style.display = 'none';
            }
        });
    } else {
        console.warn("One or more login-related elements not found.");
    }

    function openLoginBtnClickHandler() {
        if (!loggedIn) {
            loginOverlay.style.display = 'flex';
        }
    }

    function toggleUserMenu() {
        if (userMenu.hidden) {
            userMenu.hidden = false;
            userMenu.classList.add('show');
            openLoginBtn.setAttribute('aria-expanded', 'true');
        } else {
            userMenu.classList.remove('show');
            setTimeout(() => {
                userMenu.hidden = true;
            }, 300);
            openLoginBtn.setAttribute('aria-expanded', 'false');
        }
    }


    document.getElementById("register-button").addEventListener("click", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("Please enter both email and password to register.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "{}");

        if (users[email]) {
            alert("User already registered. Try logging in.");
        } else {
            users[email] = password;
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registration successful! You can now log in.");
        }
    });

    document.getElementById("login-button").addEventListener("click", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("Please enter both email and password to log in.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "{}");

        if (!users[email]) {
            alert("User not found. Please register.");
        } else if (users[email] !== password) {
            alert("Incorrect password.");
        } else {
            loginOverlay.style.display = 'none';

            loggedIn = true;
            localStorage.setItem("loggedInUser", email);

            openLoginBtn.innerHTML = '<span class="material-symbols-outlined">face_6</span>';
            openLoginBtn.classList.add('logged-in');
            openLoginBtn.setAttribute('aria-expanded', 'false');
            openLoginBtn.removeEventListener('click', openLoginBtnClickHandler);
            openLoginBtn.addEventListener('click', toggleUserMenu);
        }
    });

    document.addEventListener('click', (e) => {
        if (loggedIn && !userMenu.contains(e.target) && !openLoginBtn.contains(e.target)) {
            userMenu.hidden = true;
            openLoginBtn.setAttribute('aria-expanded', 'false');
        }
    });

    logoutBtn.addEventListener('click', () => {
        loggedIn = false;
        localStorage.removeItem("loggedInUser");
        userMenu.hidden = true;
        openLoginBtn.classList.remove('logged-in');
        openLoginBtn.innerText = 'Sign In';
        openLoginBtn.style.width = '';
        openLoginBtn.style.height = '';
        openLoginBtn.style.borderRadius = '';
        openLoginBtn.style.background = '';
        openLoginBtn.style.padding = '12px 25px';
        openLoginBtn.removeEventListener('click', toggleUserMenu);
        openLoginBtn.addEventListener('click', openLoginBtnClickHandler);
    });
});