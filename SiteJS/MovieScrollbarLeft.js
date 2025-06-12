  const API_KEY = "daa0578d277e05aeaa0fc75e8b39c36e";
    const BASE_URL = "https://api.themoviedb.org/3";

    let resultsForScroll = []; // Store results globally

    function displayResults(movies) {
      resultsForScroll = movies; // Save results globally

      const scrollDiv = document.getElementById("content-div-one-scroll");
      scrollDiv.innerHTML = "";

      if (!movies || movies.length === 0) {
        scrollDiv.innerHTML = "<p>No results found.</p>";
        return;
      }

      movies.forEach(movie => {
        const item = document.createElement("div");
        item.className = "scroll-item";
        item.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;

        item.innerHTML = `
          <div class="scroll-overlay">
            <h2>${movie.title}</h2>
            <span>${movie.release_date || 'Unknown Date'}</span>
          </div>
        `;

        scrollDiv.appendChild(item);
      });
    }
 function loadRandomMovies() {
      const page = Math.floor(Math.random() * 5 + 1);
      const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

      fetch(url)
        .then(response => response.json())
        .then(data => displayResults(data.results))
        .catch(error => console.error("Error fetching random movies:", error));
    }

    document.addEventListener("DOMContentLoaded", loadRandomMovies);
