const api_base_url = 'https://api.themoviedb.org/3';
const api_base_url_image = 'https://image.tmdb.org/t/p';
const api_key = '4739517f5c4a7ee3075aa7e1c84adeff';
const moviesContainer = document.getElementById('movies');
const inputFavoriteMovies = document.getElementById('my-fovorite-movies');
const inputSearch = document.getElementById('input-search');
const buttonSearch = document.getElementById('search-button');

buttonSearch.addEventListener('click', searchMovie);
inputSearch.addEventListener('keypress', (event) => handleSearchByEnter(event));
inputFavoriteMovies.addEventListener("change", myFavoriteMoviesStatus);

function handleSearchByEnter(event) {
  if(event.keyCode === 13) {
    clearAllMovies();
    searchMovie();
  }
}

function myFavoriteMoviesStatus() {
  const isChecked = inputFavoriteMovies.checked;
  if(isChecked){
    clearAllMovies();
    const movies = getFavoriteMovies() || [];
    movies.map(movie => renderMovie(movie));
  }else {    
    clearAllMovies();
    getAllPopularMovies();
  }
}

async function searchMovie() { 
  if(inputSearch.value !== null) {
    clearAllMovies();
    const movies = await searchMovieByName(inputSearch.value);
    movies.map(movie => renderMovie(movie));
  }
}

function clearAllMovies() {
  moviesContainer.innerHTML = '';
}

async function searchMovieByName(title) {
  const url = `${api_base_url}/search/movie?api_key=${api_key}&language=pt-BR&query=${title}&page=1&include_adult=false`;
  const response = await fetch(url);
  const { results } = await response.json();
  return results;
}

async function getAllPopularMovies() {
  const movies = await getPopularMovies();
  movies.map(movie => renderMovie(movie));
}

async function getPopularMovies() {
  const url = `${api_base_url}/movie/popular?api_key=${api_key}&language=pt-BR&page=1`;
  const response = await fetch(url);
  const { results } = await response.json();
  return results
}

function handleFavorite(elFavoriteImg, movie) {
  if(elFavoriteImg.target.classList.contains('movie-favorited')) {
    elFavoriteImg.target.classList.remove('movie-favorited');
    elFavoriteImg.target.src = '../../assets/heart.svg';
    removeMovieLocalStorege(movie.id);
    
  }else {
    elFavoriteImg.target.classList.add('movie-favorited');
    elFavoriteImg.target.src = '../../assets/heart-checked.svg';
    setMovieLocalStorage(movie);
  }
}

function getFavoriteMovies() {
  const movies = JSON.parse(localStorage.getItem('PopularMoviesFavorited'));
  return movies;
}

function setMovieLocalStorage(movie) {
  const movies = getFavoriteMovies() || [];
  movies.push(movie);
  localStorage.setItem('PopularMoviesFavorited', JSON.stringify(movies));
}

function removeMovieLocalStorege(id) {
  const movies = getFavoriteMovies() || [];
  const newMovies = movies.filter((movie) => movie.id !== id);
  localStorage.setItem('PopularMoviesFavorited', JSON.stringify(newMovies))

}

function checkMovieIsFavorited(id) {
  const movies = getFavoriteMovies() || [];
  return movies.find((movie) => movie.id === id);
}

document.addEventListener('DOMContentLoaded', async () => {
  const movies =  await getPopularMovies();
  movies.map(movie => renderMovie(movie));
});

function renderMovie(movie) {
  const {id, poster_path, title, vote_average, overview} = movie;
  const isFavorited = checkMovieIsFavorited(id);
  moviesContainer.insertAdjacentHTML('beforeend', `
    <div class="movie-container">
      <div class='movie-details'>
        <div class='movie-image'>
        ${poster_path ? `<img src='${api_base_url_image}/w200${poster_path}' alt='Imagem ilustrativa'>` : ''}          
        </div>
        <div class='movie-information'>
          <h2>${title}</h2>
          <div class='movie-score-fovorite-container'>
            <div class='score'>
              <img src='../../assets/star.svg' alt='Ícone de uma estrela'>
              <span>${vote_average}</span>
            </div>
            <div class='favorite'>
              ${
                isFavorited ? `<img id="icon-favorite-movie-${id}" class="movie-favorited" src='../../assets/heart-checked.svg' alt='Ícone de um coração não favoritado' />` 
                            : `<img id="icon-favorite-movie-${id}" src='../../assets/heart.svg' alt='Ícone de um coração favoritado' />`
              }              
              <span>Favoritar</span>
            </div>
          </div>
        </div>
      </div>
      <div class='movie-description'>
        <p>${overview}</p>
      </div>
    </div>
  `);

  const favoriteImage = document.getElementById(`icon-favorite-movie-${id}`);
  favoriteImage.addEventListener('click', (elFavoriteImg) => handleFavorite(elFavoriteImg, movie));
}