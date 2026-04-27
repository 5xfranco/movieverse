const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

// Helper: build image URLs
const poster = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : "fallback.jpg";

const backdrop = (path) =>
  path ? `https://image.tmdb.org/t/p/original${path}` : "fallback.jpg";

/* ---------------------------------------------
   SEARCH MOVIES
--------------------------------------------- */
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    const url = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
      q
    )}`;

    const { data } = await axios.get(url);

    const results = data.results.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.release_date?.slice(0, 4),
      poster: poster(m.poster_path),
      rating: m.vote_average,
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "TMDB search failed" });
  }
});

/* ---------------------------------------------
   MOVIE DETAILS
--------------------------------------------- */
router.get("/details/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const url = `${TMDB_BASE}/movie/${id}?api_key=${TMDB_KEY}&append_to_response=credits`;

    const { data } = await axios.get(url);

    res.json({
      id: data.id,
      title: data.title,
      year: data.release_date?.slice(0, 4),
      runtime: data.runtime,
      genres: data.genres.map((g) => g.name).join(", "),
      plot: data.overview,
      poster: poster(data.poster_path),
      backdrop: backdrop(data.backdrop_path),
      rating: data.vote_average,
      director:
        data.credits.crew.find((p) => p.job === "Director")?.name || "Unknown",
      actors: data.credits.cast.slice(0, 5).map((a) => a.name).join(", "),
    });
  } catch (err) {
    res.status(500).json({ error: "TMDB details failed" });
  }
});

/* ---------------------------------------------
   TRENDING
--------------------------------------------- */
router.get("/trending", async (req, res) => {
  try {
    const url = `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}`;
    const { data } = await axios.get(url);

    res.json(
      data.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster: poster(m.poster_path),
        rating: m.vote_average,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "TMDB trending failed" });
  }
});

/* ---------------------------------------------
   POPULAR
--------------------------------------------- */
router.get("/popular", async (req, res) => {
  try {
    const url = `${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`;
    const { data } = await axios.get(url);

    res.json(
      data.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster: poster(m.poster_path),
        rating: m.vote_average,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "TMDB popular failed" });
  }
});

/* ---------------------------------------------
   TOP RATED
--------------------------------------------- */
router.get("/top", async (req, res) => {
  try {
    const url = `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_KEY}`;
    const { data } = await axios.get(url);

    res.json(
      data.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster: poster(m.poster_path),
        rating: m.vote_average,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "TMDB top rated failed" });
  }
});

/* ---------------------------------------------
   GENRES
--------------------------------------------- */
router.get("/genres", async (req, res) => {
  try {
    const url = `${TMDB_BASE}/genre/movie/list?api_key=${TMDB_KEY}`;
    const { data } = await axios.get(url);

    res.json(data.genres);
  } catch (err) {
    res.status(500).json({ error: "TMDB genres failed" });
  }
});

/* ---------------------------------------------
   MOVIES BY GENRE
--------------------------------------------- */
router.get("/byGenre/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&with_genres=${id}`;
    const { data } = await axios.get(url);

    res.json(
      data.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster: poster(m.poster_path),
        rating: m.vote_average,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "TMDB genre fetch failed" });
  }
});

module.exports = router;
