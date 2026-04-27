function loadFavorites() {
  const favs = getFavorites();
  document.getElementById("favoritesList").innerHTML =
    favs.map(m => `
      <div class="card" onclick="goToDetails('${m.id}')">
        <div class="card-poster-wrap">
          <img src="${m.poster}" />
        </div>
        <div class="card-info">
          <h3>${m.title}</h3>
        </div>
      </div>
    `).join("");
}

loadFavorites();
