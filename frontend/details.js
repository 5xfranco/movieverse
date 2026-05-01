const API_BASE = "http://10.220.1.76:3000/api";

async function loadDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const res = await fetch(`${API_BASE}/movies/details/${id}`);
  const m = await res.json();

  document.getElementById("detailsPoster").src = m.poster;
  document.getElementById("detailsTitle").textContent = m.title;
  document.getElementById("detailsMeta").textContent = `${m.year} • ⭐ ${m.rating}`;
  document.getElementById("detailsPlot").textContent = m.plot;

  document.getElementById("detailsBg").style.backgroundImage = `url(${m.poster})`;

  setupFavoriteButton(id, m.title, m.poster);
}

function setupFavoriteButton(id, title, poster) {
  const btn = document.getElementById("favBtn");
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const exists = favs.some(f => f.id === id);

  btn.textContent = exists ? "Remove from Favorites" : "Add to Favorites";

  btn.onclick = () => {
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (exists) {
      favs = favs.filter(f => f.id !== id);
    } else {
      favs.push({ id, title, poster });
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
    setupFavoriteButton(id, title, poster);
  };
}

loadDetails();
