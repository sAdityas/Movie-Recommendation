import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/overview.css";

export const MovieOverview = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const id = sessionStorage.getItem('id');

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/?tmdb_id=${id}`);
        setMovie(response.data || null);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setMovie(null);
      }
      setLoading(false);
    };
    fetchMovie();
  }, []);

  if (loading) {
    return (
      <div className="overview-container">
        <div className="loading-section">
          <span className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="overview-container">
        <p>No movie found.</p>
      </div>
    );
  }

  return (
    <div className="overview-wrapper">
      {/* Background Image with Blur and Overlay */}
      <div
        className="overview-bg"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w780${movie.poster_path})`,
        }}
      />
      <div className="overview-overlay" />
        
      {/* Main Content */}
      <div className="overview-container">
        
        <div className="movie-overview">
            
          <div className="poster-wrapper">
            
            {/* Foreground Poster */}
            <img
              className="movie-poster"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Poster'
              }
              alt="Movie Poster"
            />
          </div>

          <div className="details-section">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="rating-row">
              <span className="star">⭐</span>
              <span className="rating">{movie.vote_average}/10</span>
              <span className="votes">({movie.vote_count} votes)</span>
            </div>
            <div className="meta">
              <span>🎬 {movie.release_date}</span>
              <span>🔥 Popularity: {movie.popularity.toFixed(1)}</span>
            </div>
            <button className="book-btn">Book Tickets</button>
          </div>
        </div>

        <div className="movie-description">
          <h2>About the movie</h2>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};
