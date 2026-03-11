document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    let totalPages = 1;
    const trendingContainer = document.getElementById("trending-cards");
    const upcomingContainer = document.getElementById("upcoming-cards");
    let upcomingCurrentPage = 1;
    let upcomingTotalPages = 1;

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

            movieCard.style.cursor = "pointer";
            movieCard.addEventListener("click", () => {
                window.location.href = `movie.html?id=${movie.id}`;
            });

            trendingContainer.appendChild(movieCard);
        });
    }

    loadTrendingMovies(1);

    // Allow vertical mouse wheel to scroll trending cards horizontally
    const trendingScrollWrapper = document.querySelector(".trending-cards-wrapper");
    if (trendingScrollWrapper && trendingContainer) {
        trendingScrollWrapper.addEventListener(
            "wheel",
            (e) => {
                // Only handle primarily vertical wheel movement
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault();

                    const sensitivity = 5;
                    trendingContainer.scrollBy({
                        left: e.deltaY * sensitivity,
                        behavior: "smooth",
                    });
                }
            },
            { passive: false }
        );
    }

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

    // Upcoming movies
    function loadUpcomingMovies(page = 1) {
        const url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`;

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                upcomingTotalPages = data.total_pages;
                displayUpcomingMovies(data.results);
                return data.results;
            })
            .catch(error => console.error("Error fetching upcoming movies:", error));
    }

    function displayUpcomingMovies(movies, append = true) {
        if (!upcomingContainer) return;
        if (!append) upcomingContainer.innerHTML = "";

        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("trending-card");

            movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" 
             style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px 20px 0 0;" />
            <div class="movie-title-overlay">${movie.title}</div>
            `;

            movieCard.style.cursor = "pointer";
            movieCard.addEventListener("click", () => {
                window.location.href = `movie.html?id=${movie.id}`;
            });

            upcomingContainer.appendChild(movieCard);
        });
    }

    if (upcomingContainer) {
        loadUpcomingMovies(1);

        const upcomingScrollWrapper = upcomingContainer.closest(".trending-cards-wrapper");
        if (upcomingScrollWrapper) {
            upcomingScrollWrapper.addEventListener(
                "wheel",
                (e) => {
                    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                        e.preventDefault();

                        const sensitivity = 5;
                        upcomingContainer.scrollBy({
                            left: e.deltaY * sensitivity,
                            behavior: "smooth",
                        });
                    }
                },
                { passive: false }
            );
        }

        const leftBtn = document.getElementById("scroll-left-upcoming");
        const rightBtn = document.getElementById("scroll-right-upcoming");

        if (leftBtn) {
            leftBtn.addEventListener("click", () => {
                upcomingContainer.scrollBy({
                    left: -300,
                    behavior: "smooth"
                });
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener("click", async () => {
                upcomingContainer.scrollBy({
                    left: 300,
                    behavior: "smooth"
                });

                setTimeout(async () => {
                    const scrollLeft = upcomingContainer.scrollLeft;
                    const scrollWidth = upcomingContainer.scrollWidth;
                    const clientWidth = upcomingContainer.clientWidth;

                    if (scrollLeft + clientWidth + 500 >= scrollWidth && upcomingCurrentPage < upcomingTotalPages) {
                        upcomingCurrentPage++;
                        const newMovies = await loadUpcomingMovies(upcomingCurrentPage);
                        displayUpcomingMovies(newMovies, true);
                    }
                }, 300);
            });
        }
    }
});
