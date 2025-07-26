import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LastPage.css'; // 👈 Import external stylesheet

export const LastPage = () => {
    const navigate = useNavigate()
    const [isHomeClicked, setIsHomeClicked] = useState(false)
  const [bookingData, setBookingData] = useState({
    bookingId: '',
    seats: [],
    price: '',
    title: ''
  });

  useEffect(() => {
    const bookingId = sessionStorage.getItem('bookingId');
    const seats = JSON.parse(sessionStorage.getItem('seat')) || [];
    const price = localStorage.getItem('price');
    const title = sessionStorage.getItem('title');

    setBookingData({
      bookingId,
      seats,
      price,
      title
    });
  }, []);

  const downloadExcel = async () => {
    const ticketData = {
      bookingId: sessionStorage.getItem('bookingId'),
      seats: JSON.parse(sessionStorage.getItem('seat')),
      title: sessionStorage.getItem('title'),
      time: sessionStorage.getItem('time'),
      price: localStorage.getItem('price')
    };

    const response = await fetch("http://localhost:5000/exp/excel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ticketData)
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${ticketData.title}.pdf`);  // ← changed to .pdf
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);  // clean up
    window.URL.revokeObjectURL(url);  // free memory

    sessionStorage.clear();
    localStorage.removeItem('price');
  };

  const navigateHome = () => {

    sessionStorage.clear()
    setIsHomeClicked(true)
    localStorage.removeItem('price')
    setTimeout(() => navigate('/nowPlaying', { replace: true }), 2000);
  }


  return (
    <div className="last-page-container">
      <h2 className="heading">🎟️ Your Booking Details</h2>
      <button className='home-btn' onClick={navigateHome}>Home</button>
      {isHomeClicked && (
        <div>
           <h2 className='heading'>Thank You! 😊</h2>
        </div>
      )}
      {!isHomeClicked && (

        <div className="ticket-card">
          <p><strong>Booking ID:</strong> {bookingData.bookingId}</p>
          <p><strong>Seats:</strong> {bookingData.seats.join(', ')}</p>
          <p><strong>Price:</strong> ₹{bookingData.price}</p>
          <p><strong>Movie Title:</strong> {bookingData.title}</p>
          <button className="download-btn" onClick={downloadExcel}>
            📥 Download Invoice
          </button>
        </div>
      )}
    </div>
  );
};

