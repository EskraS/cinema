const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('overlay');

menuToggle.addEventListener('click', () => {
  overlay.classList.toggle('show');
});

document.getElementById('dropdown-toggle').addEventListener('click', () => {
  document.getElementById('dropdown-menu').classList.toggle('show');
});


const openLoginBtn = document.getElementById('open-login');
const loginOverlay = document.getElementById('login-overlay');
const closeLoginBtn = document.getElementById('close-login');

openLoginBtn.addEventListener('click', () => {
  loginOverlay.style.display = 'flex';
});

closeLoginBtn.addEventListener('click', () => {
  loginOverlay.style.display = 'none';
});

// Optional: close when clicking outside the popup
loginOverlay.addEventListener('click', (e) => {
  if (e.target === loginOverlay) {
    loginOverlay.style.display = 'none';
  }
});

