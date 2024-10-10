document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const searchInput = document.getElementById('searchInput').value;
    const apiKey = 'e3124a28'; // Remplace avec ta clé API

    try {
        const response = await axios.get(`https://www.omdbapi.com/?s=${searchInput}&apikey=${apiKey}`);
        const movies = response.data.Search;

        const moviesContainer = document.getElementById('moviesContainer');
        moviesContainer.innerHTML = '';

        if (movies) {
            movies.forEach(movie => {
                const movieElement = createMovieElement(movie);
                moviesContainer.appendChild(movieElement);
                observeMovie(movieElement);
            });
        } else {
            moviesContainer.innerHTML = '<p>Aucun film trouvé.</p>';
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
    }
});

async function showMovieDetails(imdbID) {
    const apiKey = 'e3124a28'; // Remplace avec ta clé API
    const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const movie = response.data;

    // Créer le contenu du modal
    const modalContent = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>${movie.Title}</h2>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
        </div>
    `;

    async function fetchTopMovies() {
        const apiKey = 'e3124a28'; // Remplace avec ta clé API
        const topMovies = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0050083']; // Liste d'IMDB ID des meilleurs films
        const topMoviesContainer = document.getElementById('topMoviesContainer');
        topMoviesContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter
    
        for (const imdbID of topMovies) {
            const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
            const movie = response.data;
    
            const movieElement = createMovieElement(movie);
            topMoviesContainer.appendChild(movieElement);
            observeMovie(movieElement);
        }
    }
    
    // Appel de la fonction pour récupérer les meilleurs films lors du chargement
    fetchTopMovies();

    // Créer le modal
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Afficher le modal
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function createMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
        <div class="card">
            <img data-src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" class="lazy">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Year}</p>
                <button class="btn" onclick="showMovieDetails('${movie.imdbID}')">Read More</button>
            </div>
        </div>
    `;
    return movieElement;
}

function observeMovie(movieElement) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Charger l'image
                const img = entry.target.querySelector('img.lazy');
                if (img) {
                    img.src = img.getAttribute('data-src');
                }
                entry.target.classList.add('visible');
            }
        });
    });
    observer.observe(movieElement);
}
