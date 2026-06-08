import { genredropdown, login, search } from "./genredropdown.js";

const API_KEY = "9791679ca1505b194f4ab5e750f06de4";
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";
let currentSeason = Number(params.get("season")) || 1;
let currentEpisode = Number(params.get("episode")) || 1;

const videos = document.querySelector(".videos");
const similar = document.querySelector(".similar-movies");
const videoDetail = document.querySelector(".video-detail");
const episodeControls = document.querySelector(".episode-controls");
const similarTitle = document.querySelector(".similar-title");

function titleOf(item) {
  return item.title || item.name || "Untitled";
}

function posterFor(item) {
  return item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "assets/images/logo (2).png";
}

function updatePlayer() {
  const videoUrl =
    type === "tv"
      ? `https://vidcore.net/tv/${id}/${currentSeason}/${currentEpisode}`
      : `https://vidcore.net/movie/${id}`;

  videos.innerHTML = `
    <iframe
      src="${videoUrl}"
      width="100%"
      height="500px"
      frameborder="0"
      allowfullscreen
      sub="en"
    ></iframe>
  `;
}

async function fetchJson(api) {
  const response = await fetch(api);

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response.json();
}

async function similarmovies() {
  try {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`
    );

    similar.innerHTML = data.results
      .map(
        (movie) => `
        <div class="movie">
          <a class="watch-link" href="watch.html?id=${movie.id}&type=${type}&name=${encodeURIComponent(titleOf(movie))}">
            <img src="${posterFor(movie)}" alt="${titleOf(movie)}">
            <h2>${titleOf(movie)}</h2>
            <p>Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
            <button>&#9658; Play</button>
          </a>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.log(error);
  }
}

async function loadEpisodes(show) {
  if (type !== "tv" || !episodeControls) return;

  const seasons = show.seasons.filter((season) => season.season_number > 0);

  if (!seasons.length) {
    episodeControls.innerHTML = "";
    return;
  }

  if (!seasons.some((season) => season.season_number === currentSeason)) {
    currentSeason = seasons[0].season_number;
  }

  const seasonData = await fetchJson(
    `https://api.themoviedb.org/3/tv/${id}/season/${currentSeason}?api_key=${API_KEY}`
  );

  if (!seasonData.episodes.some((episode) => episode.episode_number === currentEpisode)) {
    currentEpisode = seasonData.episodes[0]?.episode_number || 1;
  }

  episodeControls.innerHTML = `
    <div class="season-dropdown-wrap">
      <button class="season-btn" type="button">
        Season ${currentSeason}
      </button>
      <div class="season-dropdown hidden">
      ${seasons
        .map(
          (season) => `
          <button class="${season.season_number === currentSeason ? "active" : ""}" type="button" data-season="${season.season_number}">
            Season ${season.season_number}
          </button>
        `
        )
        .join("")}
      </div>
    </div>
    <div class="episode-list">
      ${seasonData.episodes
        .map(
          (episode) => `
          <button class="${episode.episode_number === currentEpisode ? "active" : ""}" type="button" data-episode="${episode.episode_number}">
            E${episode.episode_number}: ${episode.name}
          </button>
        `
        )
        .join("")}
    </div>
  `;

  const seasonBtn = episodeControls.querySelector(".season-btn");
  const seasonDropdown = episodeControls.querySelector(".season-dropdown");

  seasonBtn.addEventListener("click", () => {
    seasonDropdown.classList.toggle("hidden");
  });

  episodeControls.querySelectorAll("[data-season]").forEach((button) => {
    button.addEventListener("click", async () => {
      currentSeason = Number(button.dataset.season);
      currentEpisode = 1;
      seasonDropdown.classList.add("hidden");
      await loadEpisodes(show);
      updatePlayer();
    });
  });

  episodeControls.querySelectorAll("[data-episode]").forEach((button) => {
    button.addEventListener("click", () => {
      currentEpisode = Number(button.dataset.episode);
      loadEpisodes(show);
      updatePlayer();
    });
  });
}

async function detail() {
  try {
    const movie = await fetchJson(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`
    );

    const duration =
      type === "tv"
        ? `${movie.number_of_seasons} season${movie.number_of_seasons === 1 ? "" : "s"}, ${movie.number_of_episodes} episode${movie.number_of_episodes === 1 ? "" : "s"}`
        : `${movie.runtime} minutes`;

    videoDetail.innerHTML = `
      <div class="movie">
        <img src="${posterFor(movie)}" alt="${titleOf(movie)}">

        <div class="movie-info">
          <h2>${titleOf(movie)}</h2>
          <p>Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
          <p>Release Date: ${movie.release_date || movie.first_air_date || "N/A"}</p>
          <p>Overview: ${movie.overview || "No overview available."}</p>
          <p>Duration: ${duration}</p>
          <p>Genre: ${movie.genres.map((g) => g.name).join(", ")}</p>
        </div>
      </div>
    `;

    await loadEpisodes(movie);
    updatePlayer();
  } catch (error) {
    console.log(error);
  }
}

if (similarTitle) {
  similarTitle.textContent = type === "tv" ? "Similar TV Shows" : "Similar Movies";
}

genredropdown();
search(type);
login();
detail();
similarmovies();
