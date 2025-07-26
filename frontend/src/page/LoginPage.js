import React, { useState } from 'react';
import '../styles/loginpage.css';
import axios from 'axios';

export const LoginPage = () => {
  const [message, setMessage] = useState()
  const [form, setForm] = useState({ email: '', passwd: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const {email , passwd} = form;
      const res = await axios.post('http://localhost:5000/user/login',{
        email,
        passwd
      });
      if (res.data){
        console.log('Got User User ID',res.data.id)
        localStorage.setItem('userID' , res.data.id)
        window.location.replace('/nowPlaying')
      }
      else{
        console.log("NO ID FOUND")
        setMessage(res.data.error)
        return;
      }
      setMessage(res.data?.success)
    }catch(err){
      if(err.response){
        setMessage(err.response?.data?.error)
      }else{
        setMessage("Unknown Error Occured")
      }
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h1>Log In</h1>
        <p>
          Don't have an account? <a href="/create-account" className="form-link">Create one</a>
        </p>
        <form onSubmit={handleSubmit}>
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
            placeholder="Password"
            type="password"
            name="passwd"
            value={form.passwd}
            onChange={handleChange}
            required
          />
          <button disabled={!form.email && !form.passed} type="submit" className="primary-btn">Log In</button>
        </form>
        <p className={`message ${message === 'Wrong Password Entered' ? 'error' : 'success'}`}>{message}</p>
      </div>
    </div>
  );
};

