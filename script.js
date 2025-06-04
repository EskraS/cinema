const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('overlay');

menuToggle.addEventListener('click', () => {
  overlay.classList.toggle('show');
});

document.getElementById('dropdown-toggle').addEventListener('click', () => {
  document.getElementById('dropdown-menu').classList.toggle('show');
});