
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Recommend from './components/Recommend';
import { NowPlaying } from './components/NowPlaying';

import React from 'react';
import './App.css';
import { MovieOverview } from './components/MovieOverview';
import { SeatSelect } from './components/SeatSelect';
import { SelectTheatre } from './components/SelectTheatre';
import { CreateAccount } from './page/CreateAccount';
import { LoginPage } from './page/LoginPage';
import { Finalize } from './page/Finalize';
import { LastPage } from './page/LastPage';

function App() {
  const userID = localStorage.getItem('userID');
  const done = sessionStorage.getItem('seatDone')
  const isLoggedIn = !!userID
  console.log(isLoggedIn)
  return (
    <BrowserRouter>
      <Routes>
        {/* If NOT logged in, allow ONLY '/' and '/create-account' */}
        {!isLoggedIn && !done && (

          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            {/* Any other route redirects to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* If logged in, allow access to these routes */}
        {isLoggedIn && (

          <>
            <Route path="/nowPlaying" element={<NowPlaying />} />
            <Route path="/overview" element={<MovieOverview />} />
            <Route path="/seats" element={<SeatSelect />} />
            <Route path="/theatre" element={<SelectTheatre />} />
            <Route path="/recommend" element={<Recommend />} />
            {/* Redirect login and create-account to overview if logged in */}
            <Route path="/" element={<Navigate to="/nowPlaying" replace />} />
            <Route path="/create-account" element={<Navigate to="/nowPlaying" replace />} />
            {/* Catch-all: redirect to overview */}
            <Route path="*" element={<Navigate to="/nowPlaying" replace />} />
          </>
        )}
        {isLoggedIn && done &&(
          <>
          <Route path='/finalize' element={<Finalize />} />
          <Route path='/p1' element={<LastPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

