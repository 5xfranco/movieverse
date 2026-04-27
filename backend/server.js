require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies"); // TMDB ROUTES

const app = express();
app.use(cors());
app.use(express.json());

// connectDB(); // Uncomment if you want MongoDB

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes); // TMDB ENDPOINTS

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
