console.log("movies loaded");
import { genredropdown,login,search } from "./genredropdown.js";

const weeks = document.querySelector(".rated-week");
const alltime = document.querySelector(".rated-alltime");
const weekPrev = document.querySelector(".top-rated-week .prev");
const weekNext = document.querySelector(".top-rated-week .next");
const alltimePrev = document.querySelector(".top-rated-alltime .prev");
const alltimeNext = document.querySelector(".top-rated-alltime .next");
const trending=document.querySelector(".trending")

let weekMovies = [];
let alltimeMovies = [];
let weekCurrent = 0;
let alltimeCurrent = 0;
const perpage = 4;
let weekApiPage = 1;
let alltimeApiPage = 1;
const random=Math.floor(Math.random()*20)+1;


const genres = {
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


function apikey() {
  return `https://api.themoviedb.org/3/movie/upcoming?api_key=9791679ca1505b194f4ab5e750f06de4&page=${weekApiPage}`
}

function topRatedApi() {
  return `https://api.themoviedb.org/3/movie/top_rated?api_key=9791679ca1505b194f4ab5e750f06de4&page=${alltimeApiPage}`
}

async function fetchMovies(api) {
  try {
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

function render(contain, movies, current) {
  const start = current * perpage;
  const page = movies.slice(start, start + perpage);

  contain.innerHTML = page.map((movie) => `
    <div class="movie">
 <a class="watch-link" href="watch.html?id=${movie.id}&type=movie&name=${movie.title ||movie.name}" target="_self"> 
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "assets/images/logo (2).png"}" alt="${movie.title ||movie.name}">
      <h2>${movie.title ||movie.name}</h2>
      <p>Rating: ${movie.vote_average.toFixed(1)}</p>
      <p>Release Date: ${movie.release_date}</p>
      <p>Genre: ${movie.genre_ids.map(id=>genres[id]).join(", ")}</p>

      <button class="watch">&#9658; Play</button>
      </a>
    </div>
  `).join("");
}

weekPrev.addEventListener("click", () => {
  if (weekCurrent > 0) {
    weekCurrent--;
    render(weeks, weekMovies, weekCurrent);
  }
});

weekNext.addEventListener("click", async () => {
  weekCurrent++;

  if ((weekCurrent + 1) * perpage > weekMovies.length) {
    weekApiPage++;
    weekMovies = weekMovies.concat(await fetchMovies(apikey()));
  }

  render(weeks, weekMovies, weekCurrent);
});

alltimePrev.addEventListener("click", () => {
  if (alltimeCurrent > 0) {
    alltimeCurrent--;
    render(alltime, alltimeMovies, alltimeCurrent);
  }
});

alltimeNext.addEventListener("click", async () => {
  alltimeCurrent++;

  if ((alltimeCurrent + 1) * perpage > alltimeMovies.length) {
    alltimeApiPage++;
    alltimeMovies = alltimeMovies.concat(await fetchMovies(topRatedApi()));
  }
  render(alltime, alltimeMovies, alltimeCurrent);
 
});

async function loadWeekData() {
  weekMovies = weekMovies.concat(await fetchMovies(apikey()));
  render(weeks, weekMovies, weekCurrent);

  const trendingMovie = weekMovies[random];
  trending.innerHTML=`
    <div class="trending-content">
      <p class="trending-label">Trending Today</p>
      <h1>${weekMovies[random].title ||weekMovies[random].name}</h1>
      <div class="trending-meta">
        <span>${trendingMovie.release_date}</span>
        <span>${trendingMovie.vote_count} votes</span>
         <span>${trendingMovie.genre_ids.map(id=>genres[id]).join(", ")}</span>
        <span class="rating">&#9733;${(trendingMovie.vote_average).toFixed(1)}</span>
      </div>
      <p class="description">${trendingMovie.overview}</p>
         <a class="watch-link" href="watch.html?id=${trendingMovie.id}&type=movie&name=${trendingMovie.title || trendingMovie.name}" target="_self"> 
 <button>&#9658; Play</button></a>
    </div>
    <a class="watch-link" href="watch.html?id=${trendingMovie.id}&type=movie&name=${trendingMovie.title || trendingMovie.name}" target="_self"> 
    <img src="${trendingMovie.poster_path ? `https://image.tmdb.org/t/p/w500${trendingMovie.poster_path}` : "assets/images/logo (2).png"}" alt="${trendingMovie.title || trendingMovie.name}">
    </a>
   
  `

}

async function loadAlltimeData() {
  alltimeMovies = alltimeMovies.concat(await fetchMovies(topRatedApi()));
  render(alltime, alltimeMovies, alltimeCurrent);
}

login()
genredropdown();
loadWeekData();
loadAlltimeData();
search("movie")
