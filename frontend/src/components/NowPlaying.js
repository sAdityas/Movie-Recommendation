import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/nowplaying.css';

export const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:5000/nowPlaying');
        const data = await res.json();
        console.log(data);
        setMovies(data.now_playing || []);
      } catch (error) {
        console.error('Error fetching now playing movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []); // empty dependency array ensures it runs once on mount

  const handleLogout = () => {
    localStorage.removeItem("userID")
    window.location.replace('/',{replace : true})
  }
  return (
    <div className='now-playing-container'>
      
      
      <div>
        <button className='logout-btn' onClick={handleLogout}>Logout</button>
      </div>
      <h1 className='main-header'>Now Playing Movies</h1>
      {loading && (<div className="spinner-overlay">
  <span className="loading-spinner" />
  <span className="loading-spinner delay1" />
  <span className="loading-spinner delay2" />
  <span className="loading-spinner delay3" />
</div>
)}

      <div className="movies-list">
        {movies.map((movie) => (
          <div className='movie-card' key={movie.id}>
            <h3>{movie.title}</h3>
            {movie.poster_path && (
              <img
                src={movie.poster_path}
                alt={movie.title}
                style={{ width: '150px', borderRadius: '5px' }}
              />
            )}
            <p><strong>Language:</strong> {movie.language}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> {movie.vote_average?.toFixed(2)}</p>
            <button className='book-ticket' onClick={() => {window.location.href='/overview';sessionStorage.setItem('id',movie.id);sessionStorage.setItem('title',JSON.stringify(movie.title))}}>Book Ticket</button> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default NowPlaying;
