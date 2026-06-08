import { genredropdown, search ,login} from "./genredropdown.js";
const params = new URLSearchParams(window.location.search);
const type = params.get("type");     // movie or tv
const genre = params.get("genre");   // genre id
const name = params.get("name");     // genre name

const title = document.querySelector("#genre-title");
const container = document.querySelector(".MOVIES");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let movies = [];
let current = 0;
let apiPage = 1;
const perpage = 40;
const hasGenreInfo = type && genre && name;

if (!hasGenreInfo) {
  title.textContent = "Choose a genre";
} else {
  title.textContent = `${name} ${type === "tv" ? "TV Shows" : "Movies"}`;
}

function genreApi() {
  return `https://api.themoviedb.org/3/discover/${type}?api_key=9791679ca1505b194f4ab5e750f06de4&with_genres=${genre}&sort_by=popularity.desc&page=${apiPage}`;
}

async function fetchMovies(api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Could not load genre movies");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.log(error);
    container.innerHTML = "<p>No movies found for this genre.</p>";
    return [];
  }
}

async function render() {
  if ((current + 1) * perpage > movies.length) {
    apiPage++;
    movies = movies.concat(await fetchMovies(genreApi()));
  }

  const start = current * perpage;
  const page = movies.slice(start, start + perpage);
    
  if (page.length === 0) {
    container.innerHTML = "<p>No movies found for this genre.</p>";
    return;
  }

  container.innerHTML = page.map((movie) => `
    <div class="movie">
      <a class="watch-link" href="watch.html?id=${movie.id}&type=${type}&name=${encodeURIComponent(movie.title || movie.name)}" target="_self"> 
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "assets/images/logo (2).png"}" alt="${movie.title || movie.name}">
      <h2>${movie.title || movie.name}</h2>
      <p>Rating: ${movie.vote_average.toFixed(1)}</p>
      <p>Release Date: ${movie.release_date || movie.first_air_date}</p>
      <button>&#9658; Play</button></a>
    </div>
  `).join("");
}

prev.addEventListener("click", () => {
  if (current > 0) {
    current--;
    render();
  }
    window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

next.addEventListener("click", async () => {
  current++;

  if ((current + 1) * perpage > movies.length) {
    apiPage++;
    movies = movies.concat(await fetchMovies(genreApi()));
  }

  render();
    window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

async function loadGenre() {
  movies = movies.concat(await fetchMovies(genreApi()));
  render();
}

if (hasGenreInfo) {
  loadGenre();
}
login()
genredropdown();
search(type || "movie");
