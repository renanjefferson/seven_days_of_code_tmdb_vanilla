const api_base_url = 'https://api.themoviedb.org/3';
const api_base_url_image = 'https://image.tmdb.org/t/p';
const api_key = '4739517f5c4a7ee3075aa7e1c84adeff';
const moviesContainer = document.getElementById('movies');

const inputSearch = document.getElementById('input-search');
const buttonSearch = document.getElementById('search-button');
buttonSearch.addEventListener('click', searchMovie);


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

async function getPopularMovies() {
  const url = `${api_base_url}/movie/popular?api_key=${api_key}&language=pt-BR&page=1`;
  const response = await fetch(url);
  const { results } = await response.json();
  return results
}

document.addEventListener('DOMContentLoaded', async () => {
  const movies =  await getPopularMovies();
  movies.map(movie => renderMovie(movie))
});

function renderMovie(movie) {
  moviesContainer.insertAdjacentHTML('beforeend', `
    <div class="movie-container">
      <div class='movie-details'>
        <div class='movie-image'>
        ${movie.poster_path ? `<img src='${api_base_url_image}/w200${movie.poster_path}' alt='Imagem ilustrativa'>` : ''}          
        </div>
        <div class='movie-information'>
          <h2>${movie.title}</h2>
          <div class='movie-score-fovorite-container'>
            <div class='score'>
              <img src='../../assets/star.svg' alt='Ícone de uma estrela'>
              <span>${movie.vote_average}</span>
            </div>
            <div class='favorite'>
              <img src='../../assets/heart.svg' alt='Ícone de um coração'>
              <span>Favoritar</span>
            </div>
          </div>
        </div>
      </div>
      <div class='movie-description'>
        <p>${movie.overview}</p>
      </div>
    </div>
  `);
}