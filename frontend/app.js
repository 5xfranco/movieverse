const API_BASE = "http://10.220.1.76:3000/api";

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
/* PREMIUM HOMEPAGE SEARCH SYSTEM */
/* ------------------------------------------------------ */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");

let suggestionIndex = -1;
let suggestionItems = [];
let debounceTimer = null;

/* Debounce helper */
function debounce(fn, delay = 250) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, delay);
}

/* Highlight matching text */
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "ig");
  return text.replace(regex, `<span style="color:#00ffb3;font-weight:600">$1</span>`);
}

/* Fetch + show suggestions */
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
        (m, i) => `
        <div class="suggestion-item" data-index="${i}" onclick="openFullSearch('${q}')">
          <img src="${m.poster}" class="suggestion-thumb">
          <div class="suggestion-text">
            <div class="suggestion-title">${highlightMatch(m.title, q)}</div>
            <div class="suggestion-meta">${m.year || "N/A"} • ⭐ ${m.rating || "N/A"}</div>
          </div>
        </div>
      `
      )
      .join("");

    suggestions.style.display = "block";
    suggestionItems = Array.from(document.querySelectorAll(".suggestion-item"));
    suggestionIndex = -1;

  } catch (err) {
    console.error("Search error:", err);
  }
}

/* Keyboard navigation */
function handleKeyNav(e) {
  if (!suggestionItems.length) return;

  if (e.key === "ArrowDown") {
    suggestionIndex = (suggestionIndex + 1) % suggestionItems.length;
  } else if (e.key === "ArrowUp") {
    suggestionIndex = (suggestionIndex - 1 + suggestionItems.length) % suggestionItems.length;
  } else if (e.key === "Enter") {
    const q = searchInput.value.trim();
    openFullSearch(q);
    return;
  }

  suggestionItems.forEach((item, i) => {
    item.classList.toggle("active-suggestion", i === suggestionIndex);
  });
}

/* Open full search page */
function openFullSearch(query) {
  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

/* Event listeners */
searchInput.addEventListener("input", () => debounce(showSuggestions));
searchInput.addEventListener("keydown", handleKeyNav);
searchBtn.addEventListener("click", () => openFullSearch(searchInput.value.trim()));

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
/* HOMEPAGE RECENT SEARCHES */
/* ------------------------------------------------------ */
function loadHomepageRecentSearches() {
  const list = JSON.parse(localStorage.getItem("recentSearches") || "[]");
  const section = document.getElementById("recentSearchSection");
  const chips = document.getElementById("recentSearchChips");

  if (!list.length) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";

  chips.innerHTML = list
    .slice(0, 10)
    .map(q => `<div class="chip" onclick="openFullSearch('${q}')">${q}</div>`)
    .join("");
}

function openFullSearch(query) {
  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

/* ------------------------------------------------------ */
/* INITIAL LOAD */
/* ------------------------------------------------------ */
loadRow("trending", "trendingRow");
loadRow("popular", "popularRow");
loadTopRated();
loadHomepageRecentSearches();

