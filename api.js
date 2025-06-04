const API_KEY = "daa0578d277e05aeaa0fc75e8b39c36e";
const BASE_URL = "https://api.themoviedb.org/3";

function searchMovies() {
  const query = document.getElementById("searchInput").value;
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => displayResults(data.results))
    .catch(error => console.error("Error fetching data:", error));
}

function displayResults(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // clear previous results

  if (movies.length === 0) {
    resultsDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  movies.forEach(movie => {
    const movieElement = document.createElement("div");
    movieElement.innerHTML = `
      <h2>${movie.title}</h2>
      <p>${movie.overview}</p>
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
    `;
    resultsDiv.appendChild(movieElement);
  });
}

function loadRandomMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${Math.floor(Math.random() * 5 + 1)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => displayResults(data.results))
    .catch(error => console.error("Error fetching random movies:", error));
}

document.addEventListener('DOMContentLoaded', loadRandomMovies);