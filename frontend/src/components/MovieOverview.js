import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/overview.css";

export const MovieOverview = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const id = sessionStorage.getItem('id');
  // eslint-disable-next-line no-unused-vars
  const [genre , setGenres] = useState(null)

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/?tmdb_id=${id}`);
        setMovie(response.data || null);
        setGenres(response.data.genre)
        console.log(response.data)
      } catch (err) {
        if (err.resonse){
            setMovie(err)
        }
      }
      setLoading(false);
    };
    fetchMovie();
  }, [id]);

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
          backgroundImage: `url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`,
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
            {movie.title === movie.original_title && (
               <> <h1 className="movie-title">{movie.title}</h1>
                <h3 className='tagLine'>{movie.tagline}</h3></>
            )}
            {movie.title !== movie.original_title && (
                <><h1 className="movie-title">{movie.title}</h1>
                <h3 className="movie-title">{movie.original_title}</h3>
                <h5 className='tagLine'>{movie.tagline}</h5></>
            )}
            
            <div className="rating-row">
              <span className="star">⭐</span>
              <span className="rating">{movie.vote_average}/10</span>
              <span className="votes">({movie.vote_count} votes)</span>
              {movie.genre_names && movie.genre_names.length > 0 && (
                <div className='genres'>
                    <span>🎭Genre: </span>
                    {movie.genre_names.map((genre,id) => (
                        <React.Fragment key={id}>
                        
                        <span key={id} className='genre-badge'>{genre.name}</span>
                        {id < movie.genre_names.length - 1 && (
                            <span> / </span>
                        )}
                        </React.Fragment>
                    ))}
                </div>
              )}
            </div>
            <div className="meta">
              <span>🎬 {movie.release_date}</span>
              <span> 🔥 Popularity: {movie.popularity.toFixed(1)}</span><br/>
              <span>📽️ IMDB ID: {movie.imdb_id}</span>
            </div>
            <button className="book-btn" onClick={(e) => {window.location.href='/seats'; e.preventDefault()}}>Book Tickets</button>
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
