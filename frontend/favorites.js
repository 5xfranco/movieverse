function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(list) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

function removeFavorite(id) {
  let favs = getFavorites().filter(f => f.id !== id);
  saveFavorites(favs);
  loadFavorites();
}

function createFavoriteCard(m) {
  return `
    <div class="card">
      <div class="card-poster-wrap" onclick="goToDetails('${m.id}')">
        <img src="${m.poster}">
      </div>
      <div class="card-info">
        <h3>${m.title}</h3>
        <button onclick="removeFavorite('${m.id}')">Remove</button>
      </div>
    </div>
  `;
}

function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

function loadFavorites() {
  const grid = document.getElementById("favoritesGrid");
  const empty = document.getElementById("emptyMessage");

  const favs = getFavorites();

  if (favs.length === 0) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = favs.map(createFavoriteCard).join("");
}

loadFavorites();
