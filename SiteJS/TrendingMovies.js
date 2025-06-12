document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    let totalPages = 1;
    const trendingContainer = document.getElementById("trending-cards");

    function loadTrendingMovies(page = 1) {
        const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`;

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                totalPages = data.total_pages;
                displayTrendingMovies(data.results);
                return data.results;
            })
            .catch(error => console.error("Error fetching trending movies:", error));
    }

    function displayTrendingMovies(movies, append = true) {
        if (!append) trendingContainer.innerHTML = "";

        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("trending-card");

            movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" 
             style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px 20px 0 0;" />
            <div class="movie-title-overlay">${movie.title}</div>
            `;

            trendingContainer.appendChild(movieCard);
        });
    }

    loadTrendingMovies(1);

    document.getElementById("scroll-left").addEventListener("click", () => {
        trendingContainer.scrollBy({
            left: -300,
            behavior: "smooth"
        });
    });

    document.getElementById("scroll-right").addEventListener("click", async () => {
        trendingContainer.scrollBy({
            left: 300,
            behavior: "smooth"
        });

        setTimeout(async () => {
            const scrollLeft = trendingContainer.scrollLeft;
            const scrollWidth = trendingContainer.scrollWidth;
            const clientWidth = trendingContainer.clientWidth;

            if (scrollLeft + clientWidth + 500 >= scrollWidth && currentPage < totalPages) {
                currentPage++;
                const newMovies = await loadTrendingMovies(currentPage);
                displayTrendingMovies(newMovies, true);
            }
        }, 300);
    });
});
