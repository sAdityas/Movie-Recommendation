import React, { useEffect, useState } from 'react';
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
  const [price, setPrice] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userid , setUserId] = useState(0)

  useEffect(() => {
    // ✅ Retrieve from sessionStorage
    const seatsFromStorage = JSON.parse(sessionStorage.getItem('seat') || "[]");
    console.log("Seats loaded from sessionStorage:", seatsFromStorage);

    // ✅ Fetch booked seats from backend
    axios.get("http://127.0.0.1:5000/tkt/seat")
      .then(res => {
        setBookedSeats(res.data.seats || []);
        console.log("🎟️ Booked seats from backend:", res.data.seats);
      })
      .catch(err => {
        console.error("Failed to fetch booked seats", err);
      });

    // ✅ Initial price setup
    const pricePerSeat = Number(localStorage.getItem('price')) || 0;
    setPrice(seatsFromStorage.length * pricePerSeat);
    setSelectedSeats(seatsFromStorage);
    setUserId(parseInt(localStorage.getItem('userID'),10))
  }, []);
  

  
  
  const isBooked = (seatId) => bookedSeats.includes(seatId);
  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) => {
      const updated = prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId];

      sessionStorage.setItem('seat', JSON.stringify(updated));

      const pricePerSeat = Number(localStorage.getItem('price')) || 0;
      setPrice(updated.length * pricePerSeat);

      return updated;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const time = sessionStorage.getItem('time');
      const title = sessionStorage.getItem('title');
      const seats = JSON.parse(sessionStorage.getItem('seat') || "[]");
      function generateBookingId(len = 11) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let result = '';
        for (let i = 0; i < len; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      }

      const bookingId = generateBookingId();
      sessionStorage.setItem('bookingId', bookingId);
      if (!userid){
        return;
      }
      if (!time || !title || seats.length === 0) {
        alert("Please select at least one seat.");
        return;
      }

      console.log("Confirming Ticket:", seats, title, bookingId, price,userid);

      await axios.post("http://127.0.0.1:5000/tkt/add", {
        seats,
        time,
        title,
        bookingId,
        price,
        userid,
      });

      alert("Booking successful!");
      setSelectedSeats([]);

    } catch (error) {
      if (error.response) {
        console.error("Error:", error);
        alert(error.response?.data?.error || "Something went wrong");
      } else {
        alert("Network or Server Error");
      }
    }
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
                  className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} ${isBooked(seat) ? 'disabled' : ''}`}
                  onClick={() => !isBooked(seat) && toggleSeat(seat)}
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
                  className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} ${isBooked(seat) ? 'disabled' : ''}`}
                  onClick={() => !isBooked(seat) && toggleSeat(seat)}
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
        {selectedSeats.length ? selectedSeats.join(', ') : 'No Seats Selected'}

        <div className='price-div'>
          <span className='price-span'>Total: ₹{price}</span>
        </div>
      </div>

      <button type="button" onClick={handleSubmit}>Confirm</button>
    </div>
  );
};
