console.log("movies loaded");
export function genredropdown() {

const genress = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 9648, name: "Mystery" },
  { id: 27, name: "Horror" }
];

const dropdown = document.getElementById("dropdown");
const genreBtn = document.getElementById("genreBtn");

genress.forEach(genre => {
  const link = document.createElement("a");

  link.href = `genres.html?type=movie&genre=${genre.id}&name=${genre.name}`;

  link.textContent = genre.name;

  dropdown.appendChild(link);
});

genreBtn.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
});
}
export function search(type) {
  const searchinput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const contain = document.querySelector(".search-results") || document.querySelector(".container");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  async function searchMovies() {
    const query = searchinput.value;
    if (!query.trim()) return;

    const trending = document.querySelector(".trending");
    const genre = document.querySelector(".genre");
    const alltime = document.querySelector(".top-rated-alltime");
    const videoContainer = document.querySelector(".video-container");
    const similarTitle = document.querySelector(".similar-title");
    const similarMovies = document.querySelector(".similar-movies");

    if (trending) trending.style.display = "none";
    if (genre) genre.style.display = "none";
    if (alltime) alltime.style.display = "none";
    if (contain.classList.contains("search-results")) {
      contain.classList.add("active");
      if (videoContainer) videoContainer.style.display = "none";
      if (similarTitle) similarTitle.style.display = "none";
      if (similarMovies) similarMovies.style.display = "none";
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=9791679ca1505b194f4ab5e750f06de4&query=${query}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      const result = data.results;


      if (!contain) {
        console.warn("Search results container not found on this page. Results will not be displayed.");
        return;
      }
      
      contain.innerHTML = result.map(movie => `
        <div class="movie">
         <a class="watch-link" href="watch.html?id=${movie.id}&type=${type}&name=${encodeURIComponent(movie.title || movie.name)}"> 
          <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "assets/images/logo (2).png"}" alt="${movie.title || movie.name}">
          <h2>${movie.title || movie.name}</h2>
          <p>Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
          <p>Release Date: ${movie.release_date || movie.first_air_date || "N/A"}</p>
          <button>&#9658; Play</button>
         </a>
        </div>
      `).join("");
      
    } catch (error) {
      console.log(error);
    }
    if(contain.children.length<40){
      if (next) next.style.display="none";
      if (prev) prev.style.display="none";
    }
  }

  searchBtn.addEventListener("click", searchMovies);
  searchinput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
      searchMovies()
    }
  })
}
export function login(){
  const user =document.querySelector(".user")
  const dialog= document.querySelector(".login-dialog")
  const closebtn =document.querySelector(".close-btn")
  user.addEventListener("click",()=>{
  dialog.showModal()
})
  closebtn.addEventListener("click",()=>{
    dialog.close()
  })

}
