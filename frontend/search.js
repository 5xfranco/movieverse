const API_BASE = "http://10.220.1.76:3000/api";

/* ------------------------------------------------------ */
/* DOM ELEMENTS */
/* ------------------------------------------------------ */
const input = document.getElementById("searchPageInput");
const resultsGrid = document.getElementById("searchResults");
const skeletonGrid = document.getElementById("loadingSkeletons");

const filterRating = document.getElementById("filterRating");
const filterYear = document.getElementById("filterYear");
const filterGenre = document.getElementById("filterGenre");
const filterSort = document.getElementById("filterSort");

const trendingChips = document.getElementById("trendingChips");
const recentSearches = document.getElementById("recentSearches");
const clearRecentBtn = document.getElementById("clearRecent");

/* ------------------------------------------------------ */
/* STATE */
/* ------------------------------------------------------ */
let currentQuery = "";
let currentPage = 1;
let loading = false;
let reachedEnd = false;

/* ------------------------------------------------------ */
/* INIT */
/* ------------------------------------------------------ */
window.onload = () => {
  loadYears();
  loadTrendingSearches();
  loadRecentSearches();

  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get("q");

  if (q) {
    input.value = q;
    startSearch(q);
  }
};

/* ------------------------------------------------------ */
/* LOAD YEARS (Dropdown) */
/* ------------------------------------------------------ */
function loadYears() {
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1950; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    filterYear.appendChild(opt);
  }
}

/* ------------------------------------------------------ */
/* TRENDING SEARCHES */
/* ------------------------------------------------------ */
async function loadTrendingSearches() {
  try {
    const res = await fetch(`${API_BASE}/movies/trending`);
    const data = await res.json();

    trendingChips.innerHTML = data
      .slice(0, 10)
      .map(
        m => `<div class="chip" onclick="applyChip('${m.title}')">${m.title}</div>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading trending searches:", err);
  }
}

function applyChip(text) {
  input.value = text;
  startSearch(text);
}

/* ------------------------------------------------------ */
/* RECENT SEARCHES */
/* ------------------------------------------------------ */
function loadRecentSearches() {
  const list = JSON.parse(localStorage.getItem("recentSearches") || "[]");

  recentSearches.innerHTML = list
    .map(q => `<div class="chip" onclick="applyChip('${q}')">${q}</div>`)
    .join("");
}

function saveRecentSearch(query) {
  let list = JSON.parse(localStorage.getItem("recentSearches") || "[]");

  list = list.filter(q => q !== query);
  list.unshift(query);

  if (list.length > 10) list.pop();

  localStorage.setItem("recentSearches", JSON.stringify(list));
  loadRecentSearches();
}

clearRecentBtn.addEventListener("click", () => {
  localStorage.removeItem("recentSearches");
  loadRecentSearches();
});

/* ------------------------------------------------------ */
/* SEARCH TRIGGER */
/* ------------------------------------------------------ */
input.addEventListener("input", () => {
  const q = input.value.trim();
  if (q.length >= 2) startSearch(q);
});

filterRating.addEventListener("change", () => startSearch(input.value.trim()));
filterYear.addEventListener("change", () => startSearch(input.value.trim()));
filterGenre.addEventListener("change", () => startSearch(input.value.trim()));
filterSort.addEventListener("change", () => startSearch(input.value.trim()));

/* ------------------------------------------------------ */
/* START SEARCH */
/* ------------------------------------------------------ */
function startSearch(query) {
  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  reachedEnd = false;

  resultsGrid.innerHTML = "";
  skeletonGrid.innerHTML = generateSkeletons(12);

  saveRecentSearch(query);
  fetchResults();
}

/* ------------------------------------------------------ */
/* FETCH RESULTS */
/* ------------------------------------------------------ */
async function fetchResults() {
  if (loading || reachedEnd) return;
  loading = true;

  try {
    const url = new URL(`${API_BASE}/movies/search`);
    url.searchParams.append("q", currentQuery);
    url.searchParams.append("page", currentPage);

    if (filterRating.value) url.searchParams.append("rating", filterRating.value);
    if (filterYear.value) url.searchParams.append("year", filterYear.value);
    if (filterGenre.value) url.searchParams.append("genre", filterGenre.value);
    if (filterSort.value) url.searchParams.append("sort", filterSort.value);

    const res = await fetch(url);
    const data = await res.json();

    if (data.length === 0) {
      reachedEnd = true;
      skeletonGrid.innerHTML = "";
      return;
    }

    skeletonGrid.innerHTML = "";

    resultsGrid.innerHTML += data
      .map(
        m => `
        <div class="result-card" onclick="goToDetails('${m.id}')">
          <img src="${m.poster}" class="result-poster">
          <div class="result-info">
            <h3>${m.title}</h3>
            <p>${m.year || "N/A"} • ⭐ ${m.rating || "N/A"}</p>
          </div>
        </div>
      `
      )
      .join("");

    currentPage++;
    loading = false;
  } catch (err) {
    console.error("Search error:", err);
    loading = false;
  }
}

/* ------------------------------------------------------ */
/* SKELETON LOADERS */
/* ------------------------------------------------------ */
function generateSkeletons(count) {
  return Array(count)
    .fill(0)
    .map(
      () => `
      <div class="skeleton-card">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
      </div>
    `
    )
    .join("");
}

/* ------------------------------------------------------ */
/* INFINITE SCROLL */
/* ------------------------------------------------------ */
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 600
  ) {
    fetchResults();
  }
});

/* ------------------------------------------------------ */
/* DETAILS NAVIGATION */
/* ------------------------------------------------------ */
function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}
