const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('overlay');
const openLoginBtn = document.getElementById('open-login');
const loginOverlay = document.getElementById('login-overlay');
const closeLoginBtn = document.getElementById('close-login');

menuToggle.addEventListener('click', () => {
  overlay.classList.toggle('show');
});

document.getElementById('dropdown-toggle').addEventListener('click', () => {
  document.getElementById('dropdown-menu').classList.toggle('show');
});

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

//Localstorage Login Functions

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
      alert("Login successful!");
      loginOverlay.style.display = 'none';
    }
  });