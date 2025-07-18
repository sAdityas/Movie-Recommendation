
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Recommend from './components/Recommend';
import NowPlaying from './components/NowPlaying';
import React from 'react';
import './App.css';

function App() {
 return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Recommend />} />
      <Route path="/nowPlaying" element={<NowPlaying />} />
    </Routes>
    </BrowserRouter>
 )
}

export default App;
