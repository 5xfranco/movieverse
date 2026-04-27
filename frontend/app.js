const API_BASE = "http://localhost:3000/api";

/* ------------------------------------------------------ */
/* CARD TEMPLATE (Hulu Style) */
/* ------------------------------------------------------ */
function scrollRow(id, amount) {
  document.getElementById(id).scrollBy({
    left: amount,
    behavior: "smooth"
  });
}

function createCard(movie) {
  return `
    <div class="card" onclick="goToDetails('${movie.id}')">
      <div class="card-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}">
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
/* LOAD ROWS (Trending, Popular, Top Rated) */
/* ------------------------------------------------------ */
async function loadRow(endpoint, elementId) {
  try {
    const res = await fetch(`${API_BASE}/movies/${endpoint}`);
    const data = await res.json();

    document.getElementById(elementId).innerHTML = data
      .map(createCard)
      .join("");
  } catch (err) {
    console.error(`Error loading ${endpoint}:`, err);
  }
}

/* ------------------------------------------------------ */
/* SEARCH SYSTEM (Hulu Style Suggestions) */
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
}

searchInput.addEventListener("input", showSuggestions);

searchBtn.addEventListener("click", () => {
  showSuggestions();
});

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
loadRow("toprated", "topRatedRow");
