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
    if (openLoginBtn && loginOverlay && closeLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            loginOverlay.style.display = 'flex';
        });
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
});