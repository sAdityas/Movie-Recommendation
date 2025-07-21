import React, { useState, useEffect } from 'react';
import '../styles/createaccount.css';
import axios from 'axios';

export const CreateAccount = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    passwd: '',
    agree: false
  });

  const [movies, setMovies] = useState([]);
  const [randomPoster, setRandomPoster] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/nowPlaying');
        const movieArray = res.data.now_playing || [];
        setMovies(movieArray);

        const posters = movieArray
          .filter((movie) => movie.poster_path)
          .map((movie) => movie.poster_path);

        if (posters.length > 0) {
          const randomIdx = Math.floor(Math.random() * posters.length);
          const random = posters[randomIdx];
          setRandomPoster(random);
          console.log("🎬 Random poster:", random);
        } else {
          setRandomPoster(null);
        }
      } catch (err) {
        console.error('❌ Error fetching movies:', err);
      }
    };

    fetchMovies();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { firstname, lastname, email, passwd } = form;

      const res = await axios.post("http://localhost:5000/user/create", {
        firstname,
        lastname,
        email,
        passwd
      });

      console.log("✅ User created:", res.data);

      // Clear the form (optional):
      setForm({
        firstname: '',
        lastname: '',
        email: '',
        passwd: '',
        agree: false
      });

      alert(res.data.message || "User Created Successfully");
    } catch (err) {
      console.error("❌ Error creating user:", err.response.data.error);
      
      const errorMsg = err.response?.data?.error;
      alert(errorMsg);
    }
  };

  return (
    <div className="account-container">
      <div className="left-panel">
        <div className="left-header">
          <div className="logo">AMB</div>
        </div>
        <div className="promo-content">
          <div className="promo-image">
            {randomPoster && (
              <img
                src={`https://image.tmdb.org/t/p/w500${randomPoster}`}
                alt="Random Movie Poster"
              />
            )}
          </div>
          <div className="promo-text">
            <h2>From Screen to Heart,<br />Memories in Every Frame</h2>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="form-box">
          <h1>Create an account</h1>
          <p>
            Already have an account? <a href="/" className="form-link">Log in</a>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="field-row">
              <input
                className="form-input"
                placeholder="First name"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="Last name"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
              />
            </div>
            <input
              className="form-input"
              placeholder="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="form-input"
              placeholder="Enter your password"
              type="password"
              name="passwd"
              value={form.passwd}
              onChange={handleChange}
              required
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                required
              />
              <span className="checkbox-custom"></span>
              I agree to the <a href="#" className="form-link">Terms & Conditions</a>
            </label>
            <button type="submit" className="primary-btn">Create account</button>
          </form>

          <div className="divider">Or register with</div>
          <div className="social-row">
            <button type="button" className="social-btn google-btn">Google</button>
            <button type="button" className="social-btn apple-btn">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
};
