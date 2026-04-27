/* ------------------------------------------------------ */
/* CATEGORY INFO (Hero Banner Data) */
/* ------------------------------------------------------ */
const categoryInfo = {
  action: {
    id: 28,
    title: "🔥 Action",
    bg: "images/cat-action.jpg",
    desc: "Explosive blockbusters and high‑octane adventures."
  },
  comedy: {
    id: 35,
    title: "😂 Comedy",
    bg: "images/cat-comedy.jpg",
    desc: "Laugh‑out‑loud hits and feel‑good favorites."
  },
  horror: {
    id: 27,
    title: "😱 Horror",
    bg: "images/cat-horror.jpg",
    desc: "Terrifying thrillers and chilling nightmares."
  },
  romance: {
    id: 10749,
    title: "❤️ Romance",
    bg: "images/cat-romance.jpg",
    desc: "Heartfelt stories of love, passion, and connection."
  },
  scifi: {
    id: 878,
    title: "🚀 Sci‑Fi",
    bg: "images/cat-scifi.jpg",
    desc: "Futuristic adventures and mind‑bending worlds."
  }
};

/* ------------------------------------------------------ */
/* HERO BANNER LOADER */
/* ------------------------------------------------------ */
function loadCategoryHero(cat) {
  const c = categoryInfo[cat];
  if (!c) return;

  document.getElementById("categoryHero").innerHTML = `
    <div class="cat-hero-bg" style="background-image:url('${c.bg}')"></div>
    <div class="cat-hero-content">
      <h1>${c.title}</h1>
      <p>${c.desc}</p>
    </div>
  `;
}

/* ------------------------------------------------------ */
/* LOAD MOVIES FOR CATEGORY */
/* ------------------------------------------------------ */
async function loadCategoryMovies(cat) {
  const c = categoryInfo[cat];
  if (!c) return;

  const res = await fetch(`http://localhost:3000/api/movies/byGenre/${c.id}`);
  const movies = await res.json();

  document.getElementById("categoryResults").innerHTML = `
    <h2 class="section-title">${c.title}</h2>
    <div class="card-grid">
      ${movies
        .map(
          (m) => `
        <div class="card" onclick="goToDetails('${m.id}')">
          <div class="card-poster-wrap">
            <img src="${m.poster}">
          </div>
          <div class="card-info">
            <h3>${m.title}</h3>
            <p>⭐ ${m.rating}</p>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

/* ------------------------------------------------------ */
/* NAVIGATION */
/* ------------------------------------------------------ */
function goToDetails(id) {
  window.location.href = `details.html?id=${id}`;
}

/* ------------------------------------------------------ */
/* AUTO‑LOAD CATEGORY ON PAGE OPEN */
/* ------------------------------------------------------ */
const params = new URLSearchParams(window.location.search);
const cat = params.get("cat");

loadCategoryHero(cat);
loadCategoryMovies(cat);

