import React, { useState } from 'react';
import '../styles/selectTheatre.css';
import { theatres } from '../data/Theatre';
import P from "../assests/P.png"
import I from "../assests/I.png"
import A from "../assests/A.png"

export const SelectTheatre = () => {

  const getLogo = (name) => {
    if (name.includes("PVR")) return P;
    if (name.includes("INOX")) return I;
    if (name.includes("Abhiruchi")) return A;
    return null; // or a default image
  };

  const [selectedTimes, setSelectedTimes] = useState({});

  const handleTimeClick = (theatreIndex, time) => {
    setSelectedTimes((prev) => {
      // If the same time is clicked twice, unselect it
      if (prev[theatreIndex] === time) {
        const times ={ ...prev,
          [theatreIndex]: null, // Unset the selected time
        }
        sessionStorage.setItem('time',JSON.stringify(times[0]))
        return times
      } else {
        const times = {
          ...prev,
          [theatreIndex]: time, // Set selected time
        };
        sessionStorage.setItem('time',JSON.stringify(times[0]))
        console.log(times)
        return times

      }
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault()
    window.location.href='/seats'
  }

  return (
    <div className="theatre-container">
      <button className='back-btn' onClick={(e) => {window.location.pathname = '/overview'; e.preventDefault()}}>Cancel</button>
      {theatres.map((theatre, index) => (
        <div className="theatre" key={index}>
          <div className="theatre-name">
          {
        console.log(getLogo(theatre.name))
        }
            <label>{theatre.name}</label>
          </div>

          <div className="theatre-logo">
            <img src={getLogo(theatre.name)} className={`${theatre.name[0]}`} alt={theatre.name} />
          </div>

          <div className="movie-timing">
            <ul className="timing">
              {theatre.timings.map((time, i) => (
                <li key={i}>
                  <button
                    className={`timing-btn ${
                      selectedTimes[index] === time ? 'active' : ''
                    }`}
                    onClick={() => handleTimeClick(index, time)}
                  >
                    {time}
                  </button>
                  {i < theatre.timings.length - 1 && <span> | </span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="location">
            <label>{theatre.location}</label>
          </div>

          <div className="bookbtn">
            <button disabled={!selectedTimes[index]} onClick={handleConfirm}>
              Book {selectedTimes[index] ? `(${selectedTimes[index]})` : ''}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

