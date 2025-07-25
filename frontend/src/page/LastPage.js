import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LastPage.css'; // 👈 Import external stylesheet

export const LastPage = () => {
    const navigate = useNavigate()
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
    link.setAttribute("download", `${ticketData.title}.xlsx`);
    document.body.appendChild(link);
    link.click();
    sessionStorage.clear()
    localStorage.removeItem('price')
  };

  const navigateHome = () => {
    
    sessionStorage.clear()
    localStorage.removeItem('price')
    setTimeout(() => navigate('/nowPlaying', { replace: true }), 2000);
  }
  

  return (
    <div className="last-page-container">
      <h2 className="heading">🎟️ Your Booking Details</h2><span/><button className='home-btn' onClick={navigateHome}>Home</button>
      
      <div className="ticket-card">
        <p><strong>Booking ID:</strong> {bookingData.bookingId}</p>
        <p><strong>Seats:</strong> {bookingData.seats.join(', ')}</p>
        <p><strong>Price:</strong> ₹{bookingData.price}</p>
        <p><strong>Movie Title:</strong> {bookingData.title}</p>
        <button className="download-btn" onClick={downloadExcel}>
          📥 Download Invoice
        </button>
      </div>
    </div>
  );
};
