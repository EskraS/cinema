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

    // Scroll indicator in right navbar
    const scrollIndicator = document.querySelector(".scroll-indicator");
    const rightNavbar = document.querySelector(".right-navbar");

    // Contact button scroll
    const contactBtn = document.getElementById('contact-button');
    const contactSection = document.getElementById('contact-section');
    if (contactBtn && contactSection) {
        contactBtn.addEventListener('click', () => {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

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

    if (scrollIndicator && rightNavbar) {
        const indicatorHeight = scrollIndicator.offsetHeight;
        let isDragging = false;

        const updateScrollIndicatorFromScroll = () => {
            if (isDragging) return;
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

            const navbarRect = rightNavbar.getBoundingClientRect();
            const navbarHeight = navbarRect.height;
            const maxTravel = navbarHeight - indicatorHeight - 16; // padding from top/bottom
            const offset = 8 + maxTravel * progress;

            scrollIndicator.style.top = `${offset}px`;
        };

        const updateScrollFromIndicator = (clientY) => {
            const navbarRect = rightNavbar.getBoundingClientRect();
            const navbarTop = navbarRect.top;
            const navbarHeight = navbarRect.height;

            // Position of the center of the indicator within the navbar
            let offsetWithinNavbar = clientY - navbarTop - indicatorHeight / 2;
            const maxTravel = navbarHeight - indicatorHeight - 16;

            // Clamp within track
            offsetWithinNavbar = Math.max(8, Math.min(8 + maxTravel, offsetWithinNavbar));

            const progress = (offsetWithinNavbar - 8) / maxTravel || 0;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            scrollIndicator.style.top = `${offsetWithinNavbar}px`;
            window.scrollTo({
                top: progress * docHeight,
                behavior: "auto",
            });
        };

        scrollIndicator.addEventListener("mousedown", (e) => {
            e.preventDefault();
            isDragging = true;
            document.body.style.userSelect = "none";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            updateScrollFromIndicator(e.clientY);
        });

        document.addEventListener("mouseup", () => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = "";
        });

        updateScrollIndicatorFromScroll();
        window.addEventListener("scroll", updateScrollIndicatorFromScroll);
        window.addEventListener("resize", updateScrollIndicatorFromScroll);
    }

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