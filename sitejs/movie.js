document.addEventListener("DOMContentLoaded", () => {
  // Read movie id from query string (?id=123)
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    // No id provided – go back to home for now
    window.location.href = "index.html";
    return;
  }

  // Grab DOM elements we want to fill
  const titleEl = document.getElementById("movie-title");
  const ratingEl = document.getElementById("movie-rating");
  const durationEl = document.getElementById("movie-duration");
  const genreEl = document.getElementById("movie-genre");
  const releaseEl = document.getElementById("movie-release-date");
  const overviewEl = document.getElementById("movie-overview");
  const postersEl = document.getElementById("movie-posters");
  const actorsEl = document.getElementById("movie-actors");

  // Helper to format runtime from minutes to "Xh Ym"
  function formatRuntime(minutes) {
    if (!minutes && minutes !== 0) return "Unknown duration";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  // Fetch movie details, posters, and credits from TMDB
  const detailsUrl = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
  const imagesUrl = `${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}`;
  const creditsUrl = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`;

  Promise.all([
    fetch(detailsUrl).then((res) => res.json()),
    fetch(imagesUrl).then((res) => res.json()),
    fetch(creditsUrl).then((res) => res.json()),
  ])
    .then(([movie, images, credits]) => {
      if (!movie || movie.status_code === 34) {
        // TMDB "resource not found"
        window.location.href = "index.html";
        return;
      }

      // Dynamic blurred background based on movie image
      const backdropPath = movie.backdrop_path || movie.poster_path;
      if (backdropPath) {
        const bgUrl = `https://image.tmdb.org/t/p/original${backdropPath}`;
        document.body.style.backgroundImage = `url(${bgUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

        document.documentElement.style.setProperty('--movie-bg-card', `url(${bgUrl})`);
      }

      if (titleEl) {
        const titleText = movie.title || movie.name || "Untitled";
        titleEl.textContent = titleText;
        document.title = titleText;
      }

      if (ratingEl) {
        const vote = typeof movie.vote_average === "number" ? movie.vote_average : 0;
        ratingEl.textContent = `${vote.toFixed(1)} | 10`;
      }

      if (durationEl) {
        durationEl.textContent = formatRuntime(movie.runtime);
      }

      if (genreEl) {
        const firstGenre = Array.isArray(movie.genres) && movie.genres.length > 0
          ? movie.genres[0].name
          : "Unknown genre";
        genreEl.textContent = firstGenre;
      }

      if (releaseEl) {
        const year = movie.release_date ? movie.release_date.slice(0, 4) : "Unknown";
        releaseEl.textContent = year;
      }

      if (overviewEl) {
        overviewEl.textContent = movie.overview || "No description available for this movie.";
      }

      // Posters
      if (postersEl) {
        postersEl.innerHTML = "";
        const posterBase = "https://image.tmdb.org/t/p/w300";
        const backdrops = Array.isArray(images.backdrops) ? images.backdrops : [];
        const posters = Array.isArray(images.posters) ? images.posters : [];
        const allImages = [...backdrops, ...posters];

        allImages.slice(0, 10).forEach((img) => {
          if (!img.file_path) return;
          const thumb = document.createElement("img");
          thumb.className = "movie-poster-thumb";
          thumb.src = `${posterBase}${img.file_path}`;
          thumb.alt = movie.title || movie.name || "Movie poster";
          postersEl.appendChild(thumb);
        });
      }

      // Actors (cast)
      if (actorsEl) {
        actorsEl.innerHTML = "";
        const cast = Array.isArray(credits.cast) ? credits.cast : [];
        const topCast = cast.slice(0, 10);
        const profileBase = "https://image.tmdb.org/t/p/w185";

        topCast.forEach((person) => {
          const card = document.createElement("div");
          card.className = "actor-card";

          const img = document.createElement("img");
          if (person.profile_path) {
            img.src = `${profileBase}${person.profile_path}`;
          } else {
            img.src = "https://placehold.co/55x55";
          }
          img.alt = person.name || "Actor";

          const name = document.createElement("span");
          name.textContent = person.name || "Unknown";

          card.appendChild(img);
          card.appendChild(name);
          actorsEl.appendChild(card);
        });
      }

      // Allow vertical mouse wheel to scroll posters horizontally
      if (postersEl) {
        postersEl.addEventListener(
          "wheel",
          (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              e.preventDefault();
              const sensitivity = 4;
              postersEl.scrollBy({
                left: e.deltaY * sensitivity,
                behavior: "smooth",
              });
            }
          },
          { passive: false }
        );
      }
    })
    .catch((err) => {
      console.error("Error loading movie details:", err);
      // On error, just send user back to home for now
      window.location.href = "index.html";
    });
});

