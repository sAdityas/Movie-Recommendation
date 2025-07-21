
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Recommend from './components/Recommend';
import { NowPlaying } from './components/NowPlaying';

import React from 'react';
import './App.css';
import { MovieOverview } from './components/MovieOverview';
import { SeatSelect } from './components/SeatSelect';
import { SelectTheatre } from './components/SelectTheatre';
import { CreateAccount } from './page/CreateAccount';
import { LoginPage } from './page/LoginPage';

function App() {
 return(
  <BrowserRouter>
    <Routes>
      <Route path="/create-account" element={<CreateAccount  />} />
      <Route path="/nowPlaying" element={<NowPlaying />} />
      <Route path='/overview' element={<MovieOverview />} />
      <Route path='/seats' element={<SeatSelect />} />
      <Route path='/theatre' element={<SelectTheatre />} />
      <Route path='/recommend' element={<Recommend />} />
      <Route path='/' element={<LoginPage />} />
    </Routes>
    </BrowserRouter>
 )
}

export default App;
