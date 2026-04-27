const API_BASE = "http://localhost:3000/api";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

function createCard(movie) {
  return `
    <div class="card" onclick="goToDetails('${movie.id}')">
      <div class="card-poster-wrap">
        <img src="${movie.poster}" />
      </div>

      <div class="card-info">
        <h3>${movie.title}</h3>
        <p>${movie.year || ""}</p>

        <div class="card-badges">
          <span class="rating-badge">⭐ ${movie.rating?.toFixed(1) || "N/A"}</span>
          <span class="fav-btn" onclick="toggleFavorite(event, '${movie.id}', '${movie.title}', '${movie.poster}')">❤️</span>
        </div>
      </div>
    </div>
  `;
}

// SEARCH BAR
async function searchMovies() {
  document.getElementById("spinner").classList.add("show");

  const q = document.getElementById("searchInput").value;
  const res = await fetch(`${API_BASE}/movies/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  document.getElementById("results").innerHTML = data.map(createCard).join("");

  document.getElementById("spinner").classList.remove("show");
}


// CATEGORIES PAGE
async function loadGenres() {
  const res = await fetch(`${API_BASE}/movies/genres`);
  const genres = await res.json();

  document.querySelector(".category-grid").innerHTML = genres
    .map(g => `
      <div class="category-card"
           style="background-image:url('https://image.tmdb.org/t/p/w500${g.backdrop || "/t/p/original"}')"
           onclick="openGenre(${g.id})">
        ${g.name}
      </div>
    `)
    .join("");
}

async function openGenre(id) {
  const res = await fetch(`${API_BASE}/movies/byGenre/${id}`);
  const data = await res.json();
  document.getElementById("results").innerHTML = data.map(createCard).join("");
}


// DETAILS PAGE
async function loadDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  const res = await fetch(`${API_BASE}/movies/details/${id}`);
  const m = await res.json();
  document.getElementById("details").innerHTML = `
    <h1>${m.title}</h1>
    <img src="${m.Poster}" />
<h1>${m.Title}</h1>
<p>${m.Plot}</p>
<p>Rating: ${m.imdbRating}</p>
  `;
}

function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

// LOGIN SYSTEM
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Logged in!");
  } else {
    alert("Login failed");
  }
}

async function registerUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (res.ok) alert("Registered! Now login.");
  else alert("Registration failed");
}

// Auto-run on specific pages
window.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadDetails();
});

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

function toggleFavorite(event, id, title, poster) {
  event.stopPropagation();

  let favs = getFavorites();
  const exists = favs.find(m => m.id === id);

  if (exists) {
    favs = favs.filter(m => m.id !== id);
  } else {
    favs.push({ id, title, poster });
  }

  saveFavorites(favs);
}

function toggleFavoriteFromDetails(id, title, poster) {
  let favs = getFavorites();
  const exists = favs.find(m => m.id === id);

  if (exists) {
    favs = favs.filter(m => m.id !== id);
  } else {
    favs.push({ id, title, poster });
  }

  saveFavorites(favs);
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

async function loadHeroCarousel() {
  const res = await fetch(`${API_BASE}/movies/trending`);
  const data = await res.json();

  document.getElementById("heroCarousel").innerHTML = data
    .slice(0, 6)
    .map(m => `
      <div class="hero-slide" 
           style="background-image:url('${m.poster}')"
           onclick="goToDetails('${m.id}')">
      </div>
    `)
    .join("");
}

loadHeroCarousel();


async function showSuggestions() {
  const q = searchInput.value.trim();
  if (q.length < 2) {
    suggestions.style.display = "none";
    return;
  }

  const res = await fetch(`${API_BASE}/movies/search?q=${q}`);
  const data = await res.json();

  suggestions.innerHTML = data
    .slice(0, 6)
    .map(m => `
      <div class="suggestion-item" onclick="goToDetails('${m.id}')">
        ${m.title} (${m.year || "N/A"})
      </div>
    `)
    .join("");

  suggestions.style.display = "block";
}


document.getElementById("searchInput").addEventListener("input", showSuggestions);

async function loadRow(endpoint, elementId) {
  const res = await fetch(`${API_BASE}/movies/${endpoint}`);
  const data = await res.json();
  document.getElementById(elementId).innerHTML = data.map(createCard).join("");
}

loadRow("trending", "trendingRow");
loadRow("popular", "popularRow");
loadRow("top", "topRatedRow");
