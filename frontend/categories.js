/* ------------------------------------------------------ */
/* CATEGORY INFO */
/* ------------------------------------------------------ */
const categoryInfo = {
  action: {
    id: 28,
    title: "🔥 Action",
    bg: "images/cat-action.jpg",
    desc: "Explosive blockbusters and high‑octane adventures.",
    sub: ["superhero", "war", "crime"]
  },
  comedy: {
    id: 35,
    title: "😂 Comedy",
    bg: "images/cat-comedy.jpg",
    desc: "Laugh‑out‑loud hits and feel‑good favorites.",
    sub: ["family", "romcom", "standup"]
  },
  horror: {
    id: 27,
    title: "😱 Horror",
    bg: "images/cat-horror.jpg",
    desc: "Terrifying thrillers and chilling nightmares.",
    sub: ["slasher", "ghost", "psychological"]
  },
  romance: {
    id: 10749,
    title: "❤️ Romance",
    bg: "images/cat-romance.jpg",
    desc: "Heartfelt stories of love, passion, and connection.",
    sub: ["drama", "teen", "holiday"]
  },
  scifi: {
    id: 878,
    title: "🚀 Sci‑Fi",
    bg: "images/cat-scifi.jpg",
    desc: "Futuristic adventures and mind‑bending worlds.",
    sub: ["space", "cyberpunk", "time travel"]
  }
};

/* ------------------------------------------------------ */
/* OPEN CATEGORY */
/* ------------------------------------------------------ */
function openCategory(cat) {
  window.location.href = `categories.html?cat=${cat}`;
}

/* ------------------------------------------------------ */
/* ROTATING HERO BANNER */
/* ------------------------------------------------------ */
let heroIndex = 0;

function loadCategoryHero(cat) {
  const c = categoryInfo[cat];
  if (!c) return;

  const hero = document.getElementById("categoryHero");

  function updateHero() {
    hero.innerHTML = `
      <div class="cat-hero-bg" style="background-image:url('${c.bg}')"></div>
      <div class="cat-hero-content">
        <h1>${c.title}</h1>
        <p>${c.desc}</p>
      </div>
    `;
  }

  updateHero();
  setInterval(updateHero, 6000);
}

/* ------------------------------------------------------ */
/* SUBCATEGORIES */
/* ------------------------------------------------------ */
function loadSubcategories(cat) {
  const c = categoryInfo[cat];
  if (!c) return;

  document.getElementById("subcategories").innerHTML = `
    <div class="subcat-row">
      ${c.sub
        .map(
          (s) => `
        <button class="subcat-btn" onclick="filterSub('${s}')">
          ${s.toUpperCase()}
        </button>
      `
        )
        .join("")}
    </div>
  `;
}

function filterSub(sub) {
  alert("Subcategory filter: " + sub);
}

/* ------------------------------------------------------ */
/* TOP PICKS CAROUSEL */
/* ------------------------------------------------------ */
async function loadTopPicks(cat) {
  const c = categoryInfo[cat];
  if (!c) return;

  const res = await fetch(`http://10.220.1.76:3000/api/movies/byGenre/${c.id}`);
  const movies = await res.json();

  const top = movies.slice(0, 10);

  document.getElementById("topPicksSection").innerHTML = `
    <h2 class="section-title">Top Picks in ${c.title}</h2>
    <div class="card-row-wrapper">
      <button class="scroll-btn left" onclick="scrollRow('topPicksRow', -400)">‹</button>

      <div class="card-row fade-edges" id="topPicksRow">
        ${top
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

      <button class="scroll-btn right" onclick="scrollRow('topPicksRow', 400)">›</button>
    </div>
  `;
}

function scrollRow(id, amount) {
  document.getElementById(id).scrollBy({ left: amount, behavior: "smooth" });
}

/* ------------------------------------------------------ */
/* CATEGORY MOVIES */
/* ------------------------------------------------------ */
async function loadCategoryMovies(cat) {
  const c = categoryInfo[cat];
  if (!c) return;

  const res = await fetch(`http://10.220.1.76:3000/api/movies/byGenre/${c.id}`);
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
/* AUTO‑LOAD */
/* ------------------------------------------------------ */
const params = new URLSearchParams(window.location.search);
const cat = params.get("cat");

if (cat) {
  loadCategoryHero(cat);
  loadSubcategories(cat);
  loadTopPicks(cat);
  loadCategoryMovies(cat);
}
