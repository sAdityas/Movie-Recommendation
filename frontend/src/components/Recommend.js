import React from 'react'
import { useState } from 'react';
import axios from 'axios';

export const Recommend = () => {
const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ id , setId ] = useState('');
  const [recs , setRecs] = useState([]);
  const [clicked, setClicked] = useState(false);
  const handleclick = async(e) => {
    try{
    e.preventDefault();
    setClicked(true);
    setLoading(true);
    const response = await axios.get(`http://localhost:5000/?imdb_id=${id}`,
      {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
      }
    });
    response.data ? setMovies([response.data]) : setMovies([]);
    setLoading(false);
    setClicked(false);
  
  
    const res = await axios.get(`http://localhost:5000/recommend?id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
      }
    });
    const recommendations = res.data?.recommendations || [];
    setRecs(recommendations);
    console.log(recommendations)
    setId('');
    }catch (error) {
    if (error.response) {
      console.error('Error fetching movie data:', error.response.data);
    }
    setLoading(false);
    setClicked(false);
    setMovies([]);
  }
  
  }
  return (
  <div className="App">
    <header className="App-header">
      <h1>Welcome to the Movie Info App</h1>

      <div className="App-content">
        {/* Input & Button */}
        <label htmlFor="id">Enter IMDB ID:</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="tt1234567"
          required
          minLength={9}
          maxLength={10}
          pattern="tt[0-9]{7,8}"
          autoFocus
        />
        <button onClick={handleclick} disabled={loading}>
          {clicked ? 'Loading...' : 'Get Movies'}
        </button>
        {loading ? <span className='loading-spinner'></span> : null}
        {!loading && movies.length >= 1 && (
          <div className="movie-info">
            <h3 className="movie-header">Title: {movies[0].title}</h3>
            <div className="movie-poster">
              <img
                src={
                  movies[0].poster_path
                    ? `https://image.tmdb.org/t/p/w780${movies[0].poster_path}`
                    : 'https://via.placeholder.com/780x439?text=No+Image'
                }
                alt="Movie Poster"
              />
            </div>
            <div className="movie-details">
              <p>Overview: {movies[0].overview}</p>
              <p>Release Date: {movies[0].release_date}</p>
              <p>Rating: {movies[0].vote_average}</p>
              <p>Popularity: {movies[0].popularity}</p>
              <p>Vote Count: {movies[0].vote_count}</p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {!loading && movies.length >= 1 && (
        <div className="recommendations-section">
          <h2>Recommendations Based on "{movies[0].title}"</h2>
          
          {recs.length === 0 && loading? (
            <>
            <span className='loading-spinner'/>
            <p>No recommendations found.</p></>
          ) : (
            <div className="recommendations">
              {recs.map((movie, idx) => (
                <div key={movie.id || idx} className="recommendation">
                  <h3 className="Title">{movie.title}</h3>
                  <img
                    className="Poster-Recommendation"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                        : 'https://via.placeholder.com/780x439?text=No+Image'
                    }
                    alt="Recommendation Poster"
                  />
                  <p>Overview: {movie.overview}</p>
                  <p>Release Date: {movie.release_date}</p>
                  <p>Rating: {movie.vote_average}</p>
                  <p>Popularity: {movie.popularity}</p>
                  <p>Vote Count: {movie.vote_count}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </header>

    <footer className="App-footer">
      <p>Made with ❤️ by Aditya Sarkale</p>
    </footer>
  </div>
);
}

export default Recommend;