import { genredropdown,login,search} from "./genredropdown.js";

const type = document.body.dataset.type;
const moviesContainer = document.querySelector(".MOVIES");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let movies = [];
let current = 0;
let apiPage = 1;
const perpage = 40;

const movieGenres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

const seriesGenres= {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western"
};


const settings={
  movie:{
  title:"Movies",
  api:"https://api.themoviedb.org/3/discover/movie",
  dateKey:"release_date",
  genres:movieGenres,
},
tv:{
  title:"Series",
  api:"https://api.themoviedb.org/3/discover/tv",
  dateKey:"first_air_date",
  genres:seriesGenres,
}
}
const currentSetting = settings[type]
function moviesApi() {
  return `${currentSetting.api}?api_key=9791679ca1505b194f4ab5e750f06de4&page=${apiPage}`;
}
async function fetchMovies(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function render() {
   if ((current + 1) * perpage > movies.length) {
    apiPage++;
    movies = movies.concat(await fetchMovies(moviesApi()));
  }

  
  const start = current * perpage;
  const page = movies.slice(start, start + perpage);

  moviesContainer.innerHTML = page.map((movie) => `
    <div class="movie">
     <a class="watch-link" href="watch.html?id=${movie.id}&type=${type}&name=${movie.title || movie.name}" target="_self"> 
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "assets/images/logo (2).png"}" alt="${movie.title || movie.name}">
      <h2>${movie.title || movie.name}</h2>
      <p>Rating: ${movie.vote_average.toFixed(1)}</p>
     <p>Release Date: ${movie[currentSetting.dateKey]}</p>
      <p>Genre: ${movie.genre_ids.map(id => currentSetting.genres[id]).join(", ")}</p>
      <button>&#9658; Play</button>
      </a>
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
    movies = movies.concat(await fetchMovies(moviesApi()));
  }

  render();
    window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

async function loadMovies() {
  movies = movies.concat(await fetchMovies(moviesApi()));
  render();
}

const datatypes=document.body.dataset.type
genredropdown();
loadMovies();
search(datatypes)
login()
