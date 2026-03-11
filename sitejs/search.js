document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".home-search");
    const searchPanel = document.getElementById("search-panel");
    const panelSearch = document.querySelector(".panel-search");
    const panelMovies = document.querySelector(".panel-movies");

    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function displayResults(movies) {
        const resultsDiv = document.querySelector(".panel-movies");
        resultsDiv.innerHTML = "";

        if (!movies || movies.length === 0) {
            resultsDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        movies.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("panel-card");

            movieElement.innerHTML = `
                <div class="card-container">
                    <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.title}" />
                    <div class="title-overlay"><span>${movie.title}</span></div>
                </div>
            `;

            resultsDiv.appendChild(movieElement);
        });
    }

    async function searchMovies(query) {
        if (!query.trim()) {
            panelMovies.innerHTML = "";
            return;
        }
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayResults(data.results);
        } catch (error) {
            console.error("Error fetching data:", error);
            panelMovies.innerHTML = "<p style='color:white; text-align:center;'>Error fetching results.</p>";
        }
    }

    const debouncedSearch = debounce(searchMovies, 400);

    // Close panel helper
    function closePanel() {
        searchPanel.classList.remove("active");
        searchPanel.addEventListener("transitionend", () => {
            searchPanel.hidden = true;
            searchBar.setAttribute("placeholder", "Search...");
            panelSearch.setAttribute("placeholder", "Search");
            panelMovies.innerHTML = "";
            panelSearch.value = "";
        }, { once: true });
        searchBar.blur();
        panelSearch.blur();
        document.body.classList.remove("no-scroll");
    }

    searchBar.addEventListener("focus", () => {
        searchPanel.hidden = false;
        requestAnimationFrame(() => {
            searchPanel.classList.add("active");
            panelSearch.focus();
        });
        searchBar.removeAttribute("placeholder");
        panelSearch.removeAttribute("placeholder");
        document.body.classList.add("no-scroll");
    });

    // Getting rid of that placeholder when clicking on the code instead of after WHen you stay typing
    panelSearch.addEventListener("focus", () => {
        panelSearch.removeAttribute("placeholder");
    });

    // Run search on panel-search input (debounced)
    panelSearch.addEventListener("input", (e) => {
        const query = e.target.value;
        debouncedSearch(query);
    });

    // Click outside to close panel
    document.addEventListener("click", (e) => {
        if (!searchPanel.contains(e.target) && !searchBar.contains(e.target) && e.target !== panelSearch) {
            closePanel();
        }
    });

    // Escape key closes panel
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !searchPanel.hidden) {
            closePanel();
        }
    });
});
