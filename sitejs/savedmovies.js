function displaySavedMovies(movies) {
  const savedDiv = document.getElementById("saved-cards");
  if (!savedDiv) return;
  savedDiv.innerHTML = "";

  if (!movies || movies.length === 0) {
    const placeholders = [
      // Inception sometimes has flaky remote poster URLs, use a stable one
      { id: 27205, title: "Inception", poster_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg", release_date: "2010-07-16" },
      { id: 603, title: "The Matrix", poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", release_date: "1999-03-31" },
      { id: 157336, title: "Interstellar", poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", release_date: "2014-11-07" }
    ];
    movies = placeholders;
  }

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "saved-card";
    const posterPath = movie.poster_path || "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg";
    card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${posterPath})`;

    card.innerHTML = `
      <div class="saved-overlay">
        <h2>${movie.title}</h2>
        <span>${movie.release_date || 'Unknown Date'}</span>
      </div>
    `;

    if (movie.id) {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `movie.html?id=${movie.id}`;
      });
    }

    savedDiv.appendChild(card);
  });
}

function displayFavoriteMovies(movies) {
  const favoritesDiv = document.getElementById("favorite-cards");
  if (!favoritesDiv) return;
  favoritesDiv.innerHTML = "";

  if (!movies || movies.length === 0) {
    favoritesDiv.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "saved-card";
    const posterPath = movie.poster_path || "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg";
    card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${posterPath})`;

    card.innerHTML = `
      <div class="saved-overlay">
        <h2>${movie.title}</h2>
        <span>${movie.release_date || 'Unknown Date'}</span>
      </div>
    `;

    favoritesDiv.appendChild(card);
  });
}

function readMoviesFromLocalStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Example usage: load some saved/favorite movies (replace with your actual saved data source)
document.addEventListener("DOMContentLoaded", () => {
  const saved = readMoviesFromLocalStorage("savedMovies");
  const favorites = readMoviesFromLocalStorage("favoriteMovies");

  // Back-compat with older key names if you already used them elsewhere
  const favoritesFallback = favorites.length ? favorites : readMoviesFromLocalStorage("favoritesMovies");

  displaySavedMovies(saved);
  displayFavoriteMovies(favoritesFallback);
});
