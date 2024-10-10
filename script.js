const API_KEY = 'e3124a28';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const moviesGrid = document.getElementById('movies-grid');
const modal = document.getElementById('movie-modal');
const closeModal = document.getElementById('close-modal');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value;
    fetchMovies(query);
});

async function fetchMovies(query) {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === 'True') {
        displayMovies(data.Search);
    } else {
        alert('Aucun film trouvé !');
    }
}

function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.setAttribute('data-aos', 'fade-down-right'); // Effet AOS
        movieCard.setAttribute('data-aos-delay', `${index * 150}`); // Délai pour chaque film
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" style="width: 100%; height: auto;">
            <h3>${movie.Title}</h3>
            <p>Date de sortie : ${movie.Year}</p>
            <button class="read-more" data-id="${movie.imdbID}">Read More</button>
        `;
        moviesGrid.appendChild(movieCard);

        // Afficher les films avec un effet AOS
        setTimeout(() => {
            movieCard.classList.add('show'); 
        }, index * 150); // Délai pour chaque film
    });

    // Ajouter l'événement au bouton "Read More"
    const readMoreButtons = document.querySelectorAll('.read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const movieId = button.getAttribute('data-id');
            fetchMovieDetails(movieId);
        });
    });
}

async function fetchMovieDetails(movieId) {
    const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === 'True') {
        showModal(data);
    } else {
        console.error("Erreur lors de la récupération des détails du film :", data.Error);
    }
}

function showModal(movie) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close" id="close-modal">&times;</span>
        <h2>${movie.Title}</h2>
        <p>${movie.Plot}</p>
        <p><strong>Date de sortie :</strong> ${movie.Released}</p>
        <p><strong>Note :</strong> ${movie.imdbRating}</p>
        <img src="${movie.Poster}" alt="${movie.Title}" style="width: 100%; height: auto;">
    `;
    modal.style.display = 'block';

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
