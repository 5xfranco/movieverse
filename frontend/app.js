const API_BASE = "http://localhost:3000/api";

/* ------------------------------------------------------ */
/* PARALLAX HERO BANNER */
/* ------------------------------------------------------ */
window.addEventListener("scroll", () => {
  const offset = window.scrollY * 0.3;
  const bg = document.getElementById("heroBannerBg");
  if (bg) bg.style.transform = `translateY(${offset}px)`;
});

/* ------------------------------------------------------ */
/* SCROLL ARROWS */
/* ------------------------------------------------------ */
function scrollRow(id, amount) {
  document.getElementById(id).scrollBy({
    left: amount,
    behavior: "smooth"
  });
}

/* ------------------------------------------------------ */
/* RANDOM HERO BANNER */
/* ------------------------------------------------------ */
async function loadRandomHero() {
  try {
    const res = await fetch(`${API_BASE}/movies/trending`);
    const movies = await res.json();

    const random = movies[Math.floor(Math.random() * movies.length)];

    document.getElementById("heroBannerBg").style.backgroundImage =
      `url(${random.poster})`;

    document.getElementById("heroBannerTitle").textContent = random.title;
    document.getElementById("heroBannerDesc").textContent =
      `${random.year} • ⭐ ${random.rating}`;
  } catch (err) {
    console.error("Error loading hero banner:", err);
  }
}

loadRandomHero();

/* ------------------------------------------------------ */
/* CARD TEMPLATE (UPGRADED) */
/* ------------------------------------------------------ */
let topRatedData = []; // MUST be above createCard()

function createCard(movie, index, arr) {
  const isTopRated = arr === topRatedData;
  const isSpotlight = isTopRated && index === 0;

  return `
    <div class="card ${isSpotlight ? "spotlight-card" : ""}" onclick="goToDetails('${movie.id}')">
      <div class="card-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}">
        <div class="rating-badge">⭐ ${movie.rating}</div>
        <div class="hover-gradient"></div>
      </div>

      <div class="card-info">
        <h3>${movie.title}</h3>
        <p>${movie.year || ""}</p>
      </div>
    </div>
  `;
}

function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

/* ------------------------------------------------------ */
/* LOAD ROWS (Trending, Popular) */
/* ------------------------------------------------------ */
async function loadRow(endpoint, elementId) {
  try {
    const res = await fetch(`${API_BASE}/movies/${endpoint}`);
    const data = await res.json();

    document.getElementById(elementId).innerHTML =
      data.map((m, i, arr) => createCard(m, i, arr)).join("");
  } catch (err) {
    console.error(`Error loading ${endpoint}:`, err);
  }
}

/* ------------------------------------------------------ */
/* TOP RATED — SPECIAL LOADER */
/* ------------------------------------------------------ */
async function loadTopRated() {
  try {
    const res = await fetch(`${API_BASE}/movies/top`);
    topRatedData = await res.json();

    document.getElementById("topRatedRow").innerHTML =
      topRatedData.map((m, i) => createCard(m, i, topRatedData)).join("");
  } catch (err) {
    console.error("Error loading Top Rated:", err);
  }
}

/* ------------------------------------------------------ */
/* SEARCH SYSTEM */
/* ------------------------------------------------------ */
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");

async function showSuggestions() {
  const q = searchInput.value.trim();
  if (q.length < 2) {
    suggestions.style.display = "none";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/movies/search?q=${q}`);
    const data = await res.json();

    suggestions.innerHTML = data
      .slice(0, 6)
      .map(
        m => `
        <div class="suggestion-item" onclick="goToDetails('${m.id}')">
          ${m.title} (${m.year || "N/A"})
        </div>
      `
      )
      .join("");

    suggestions.style.display = "block";
  } catch (err) {
    console.error("Search error:", err);
  }
}

searchInput.addEventListener("input", showSuggestions);
searchBtn.addEventListener("click", showSuggestions);

/* ------------------------------------------------------ */
/* FAVORITES SYSTEM */
/* ------------------------------------------------------ */
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

/* ------------------------------------------------------ */
/* INITIAL LOAD */
/* ------------------------------------------------------ */
loadRow("trending", "trendingRow");
loadRow("popular", "popularRow");
loadTopRated();
