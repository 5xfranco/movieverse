const API_BASE = "http://localhost:3000/api";

async function loadDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("detailsRoot").innerHTML = "<p>Movie not found.</p>";
    return;
  }

  const res = await fetch(`${API_BASE}/movies/details/${id}`);
  const m = await res.json();

  renderDetails(m);
}

function goHome() {
  window.location.href = "index.html";
}

function renderDetails(m) {
  const root = document.getElementById("detailsRoot");

  root.innerHTML = `
    <section class="details-hero">
      <div class="details-bg" style="background-image:url('${m.backdrop}')"></div>
      <div class="details-overlay"></div>

      <button class="back-btn" onclick="goHome()">← Home</button>

      <div class="details-content">
        <div class="details-poster">
          <img src="${m.poster}" />
        </div>

        <div class="details-text">
          <h1>${m.title}</h1>

          <p class="details-meta">
            ${m.year} • ${m.runtime} min • ${m.genres}
          </p>

          <p class="details-rating">⭐ ${m.rating?.toFixed(1)}</p>

          <p class="details-plot">${m.plot}</p>

          <p class="details-extra">
            <strong>Director:</strong> ${m.director}<br/>
            <strong>Cast:</strong> ${m.actors}<br/>
          </p>

          <button class="fav-details-btn" onclick="toggleFavoriteFromDetails('${m.id}', '${m.title}', '${m.poster}')">
            ❤️ Add to Favorites
          </button>
        </div>
      </div>
    </section>
  `;
}
