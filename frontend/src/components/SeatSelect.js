import React, { useState } from 'react';
import '../styles/seatSelect.css';
import axios from 'axios';


const LEFT_BLOCK_ROWS = 10;
const RIGHT_BLOCK_ROWS = 10;
const SEATS_PER_BLOCK = 3;

const generateRows = (rows, block = 'Left') =>
  [...Array(rows)].map((_, rowIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex); // 'A', 'B', etc.
    return Array(SEATS_PER_BLOCK)
      .fill(0)
      .map((_, seatIndex) => `${block}-${rowLabel}${seatIndex + 1}`);
  });

export const SeatSelect = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) => {
      const updated =
        prev.includes(seatId)
          ? prev.filter((s) => s !== seatId)
          : [...prev, seatId];
      
      sessionStorage.setItem('seat', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = async(e) => {
     e.preventDefault()
    try{
    const time = sessionStorage.getItem('time')
    const seats = JSON.parse(sessionStorage.getItem('seat') || '[]')
    const title = sessionStorage.getItem('title')

      function generateBookingId(len = 11){
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        let result = ''
        for (let i = 0; i < len; i++ ){
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }


    const bookingId = generateBookingId()
    sessionStorage.setItem('bookingId',bookingId)
    console.log("Confirming Ticket : ",seats,title,bookingId)

    if (time ==='' || title.length===0 || seats.length===0){
      alert("Please select atleast one seats.")
      return;
    }
      
    await axios.post("http://127.0.0.1:5000/tkt/add", {
      seats,
      time,
      title,
      bookingId
    });
    setSelectedSeats([])
  }catch(error){
    if (error.response){
      console.log("Error:",error)
    }
  }

  }
  const leftSeats = generateRows(LEFT_BLOCK_ROWS, 'Left');
  const rightSeats = generateRows(RIGHT_BLOCK_ROWS, 'Right');

  return (
    <div className='theater-container'>
      <div className='projectors'>🎬 🎬</div>

      <div className='screen'>SCREEN</div>

      <div className='seating-layout'>
        <div className='seat-block'>
          {leftSeats.map((row, rowIndex) => (
            <div key={`left-row-${rowIndex}`} className='seat-row'>
              {row.map((seat) => (
                <div
                  key={seat}
                  className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                  onClick={() => toggleSeat(seat)}
                >
                  💺
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className='aisle'>AISLE</div>

        <div className='seat-block'>
          {rightSeats.map((row, rowIndex) => (
            <div key={`right-row-${rowIndex}`} className='seat-row'>
              {row.map((seat) => (
                <div
                  key={seat}
                  className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                  onClick={() => toggleSeat(seat)}
                >
                  💺
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className='selected-info'>
        🎟️ <strong>Selected Seats:</strong>{' '}
        {selectedSeats.length ? selectedSeats.join(', ') : 'None'}
        
      </div>
      <button type="button" onClick={ handleSubmit }>Confirm</button>
    </div>
  );
};
