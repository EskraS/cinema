let savedMovies = []; // This will hold the saved movies globally

function displaySavedMovies(movies) {
  savedMovies = movies; // Store saved movies globally

  const savedDiv = document.getElementById("saved-cards");
  savedDiv.innerHTML = "";

  if (!movies || movies.length === 0) {
    savedDiv.innerHTML = "<p>No saved movies found.</p>";
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "saved-card";
    card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;

    card.innerHTML = `
      <div class="saved-overlay">
        <h2>${movie.title}</h2>
        <span>${movie.release_date || 'Unknown Date'}</span>
      </div>
    `;

    savedDiv.appendChild(card);
  });
}

// Example usage: load some saved movies (replace with your actual saved movie data)
document.addEventListener("DOMContentLoaded", () => {
  // Example saved movies data - replace with your own saved data source
  const exampleSavedMovies = [
    { title: "Inception", poster_path: "/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg", release_date: "2010-07-16" },
    { title: "The Matrix", poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", release_date: "1999-03-31" },
    { title: "Interstellar", poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", release_date: "2014-11-07" }
  ];

  displaySavedMovies(exampleSavedMovies);
});
