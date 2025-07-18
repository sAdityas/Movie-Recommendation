import React, { useEffect, useState } from 'react';
import '../styles/nowplaying.css';

export const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className='now-playing-container'>
      <h1 className='main-header'>Now Playing Movies</h1>
      {loading && <span className='loading-spinner' />}

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
            <p><strong>Rating:</strong> {movie.vote_average}</p>
            <button className='book-ticket' onClick={() => {sessionStorage.setItem('id',movie.id)}}>Book Ticket</button> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default NowPlaying;
