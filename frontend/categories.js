const API_BASE = "http://localhost:3000/api";

async function openCategory(keyword) {
  document.getElementById("spinner").classList.add("show");

  const res = await fetch(`${API_BASE}/movies/search?q=${keyword}`);
  const data = await res.json();

  document.getElementById("results").innerHTML = data.map(createCard).join("");

  document.getElementById("spinner").classList.remove("show");
}
async function loadCarousel(keyword, elementId) {
  const res = await fetch(`${API_BASE}/movies/search?q=${keyword}`);
  const data = await res.json();
  document.getElementById(elementId).innerHTML = data.map(createCard).join("");
}

loadCarousel("action", "carousel-action");
