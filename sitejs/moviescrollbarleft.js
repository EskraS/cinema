let popularMovies = [];
let currentHeroIndex = 0;
let heroIntervalId = null;
let isHeroAnimating = false;

function applyHeroText(movie) {
  const heroDate = document.getElementById("hero-date");
  const heroTitle = document.getElementById("hero-title");
  const heroDescription = document.getElementById("hero-description");

  if (!heroDate || !heroTitle || !heroDescription) return;

  heroDate.textContent = movie.release_date || "Unknown Date";
  heroTitle.textContent = movie.title || movie.name || "Untitled";
  const overview =
    movie.overview || "No description available for this movie.";
  const maxLen = 220;
  heroDescription.textContent =
    overview.length > maxLen ? overview.slice(0, maxLen).trimEnd() + "..." : overview;
}

function updateHeroFromMovie(movie) {
  if (!movie || isHeroAnimating) return;

  const heroImg = document.getElementById("hero-image");
  const container = document.getElementById("content-div-one-content");
  if (!heroImg || !container) return;

  const backdrop = movie.backdrop_path || movie.poster_path;
  if (!backdrop) { applyHeroText(movie); return; }

  const overview = movie.overview || "No description available.";
  const maxLen = 220;
  const shortOverview = overview.length > maxLen
    ? overview.slice(0, maxLen).trimEnd() + "..."
    : overview;

  // One unit: image + dark overlay + text all together
  const slide = document.createElement("div");
  slide.className = "hero-slide";

  const img = document.createElement("img");
  img.src = `https://image.tmdb.org/t/p/w780${backdrop}`;
  img.alt = movie.title || movie.name || "Movie image";

  const overlay = document.createElement("div");
  overlay.className = "hero-slide-overlay-content";
  overlay.innerHTML = `
  <div class="overlay-bottom">
      <div class="overlay-text">
          <span>${movie.release_date || "Unknown Date"}</span>
          <h1>${movie.title || movie.name || "Untitled"}</h1>
          <p>${shortOverview}</p>
      </div>
  </div>
  `;

  slide.appendChild(img);
  slide.appendChild(overlay);

  isHeroAnimating = true;

  img.addEventListener("load", () => {
    container.appendChild(slide);
    void slide.offsetWidth; // force reflow
    slide.style.transform = "translateX(0)";

    slide.addEventListener("transitionend", () => {
      heroImg.src = img.src;
      heroImg.alt = img.alt;
      applyHeroText(movie);
      container.removeChild(slide);
      isHeroAnimating = false;
    }, { once: true });
  });
}

function displayResults(movies) {
  const scrollDiv = document.getElementById("content-div-one-scroll");
  scrollDiv.innerHTML = "";

  if (!movies || movies.length === 0) {
    scrollDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  // Save list for automatic hero rotation
  popularMovies = movies.slice();
  currentHeroIndex = 0;
  updateHeroFromMovie(popularMovies[currentHeroIndex]);

  // Clear any existing interval before starting a new one
  if (heroIntervalId !== null) {
    clearInterval(heroIntervalId);
  }

  heroIntervalId = setInterval(() => {
    if (!popularMovies.length) return;
    currentHeroIndex = (currentHeroIndex + 1) % popularMovies.length;
    updateHeroFromMovie(popularMovies[currentHeroIndex]);
  }, 3000); // change hero every 3 seconds

  // Wire hero Watch/Trailer buttons to current hero movie
  const watchBtn = document.getElementById("hero-watch-button");
  const trailerBtn = document.getElementById("hero-trailer-button");

  const goToCurrentMovie = () => {
    if (!popularMovies.length) return;
    const movie = popularMovies[currentHeroIndex];
    if (!movie || !movie.id) return;
    window.location.href = `movie.html?id=${movie.id}`;
  };

  if (watchBtn && !watchBtn._wired) {
    watchBtn._wired = true;
    watchBtn.style.cursor = "pointer";
    watchBtn.addEventListener("click", goToCurrentMovie);
  }

  if (trailerBtn && !trailerBtn._wired) {
    trailerBtn._wired = true;
    trailerBtn.style.cursor = "pointer";
    trailerBtn.addEventListener("click", goToCurrentMovie);
  }

  movies.forEach((movie, index) => {
    const item = document.createElement("div");
    item.className = "scroll-item";
    item.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;

    item.innerHTML = `
      <div class="scroll-overlay">
        <h2>${movie.title}</h2>
        <span>${movie.release_date || "Unknown Date"}</span>
      </div>
    `;

    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      window.location.href = `movie.html?id=${movie.id}`;
    });

    scrollDiv.appendChild(item);
  });
}

function loadRandomMovies() {
  const page = Math.floor(Math.random() * 5 + 1);
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayResults(data.results))
    .catch((error) => console.error("Error fetching random movies:", error));
}

document.addEventListener("DOMContentLoaded", loadRandomMovies);
