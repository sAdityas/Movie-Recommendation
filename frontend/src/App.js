
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Recommend from './components/Recommend';
import { NowPlaying } from './components/NowPlaying';

import React from 'react';
import './App.css';
import { MovieOverview } from './components/MovieOverview';
import { SeatSelect } from './components/SeatSelect';
import { SelectTheatre } from './components/SelectTheatre';

function App() {
 return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Recommend />} />
      <Route path="/nowPlaying" element={<NowPlaying />} />
      <Route path='/overview' element={<MovieOverview />} />
      <Route path='/seats' element={<SeatSelect />} />
      <Route path='/theatre' element={SelectTheatre} />
    </Routes>
    </BrowserRouter>
 )
}

export default App;
