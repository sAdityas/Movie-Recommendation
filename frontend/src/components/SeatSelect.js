import React, { useState } from 'react';
import '../styles/seatSelect.css';

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
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

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
    </div>
  );
};
