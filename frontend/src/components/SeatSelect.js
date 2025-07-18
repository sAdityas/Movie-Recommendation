import React, { useState } from 'react'
import '../styles/seatSelect.css'
import Chair from '../assests/Chair.jpg'


const rows = ['A','B','C','D','E','F']
const cols = 17;

export const SeatSelect = () => {

    const [selectedSeats , setSelectedSeats] = useState([])

    const toggleSeat = (seat) =>{
        setSelectedSeats((prev) => prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev , seat]);
    };


  return (
    <div className='seat-selection-container'>
        <div className='screen'>
            Screen
            </div>
            <div className='seats-container'>
                {rows.map((row) => Array.from({length: cols}, (_,colIndex) => {
                    const seat = `${row}${colIndex + 1}`
                    const isSelected = selectedSeats.includes(seat);
                    return (
                            <div
                            key={seat}
                            className={`seat ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSeat(seat)}
                            >
                            {parseInt(seat.slice(1)) === 5 && (
                            <div className="divider"></div> // insert aisle after every 4 seats
                            )}

                            <img className="chair-img" src={Chair} alt="Chair" />
                            <span className="seat-label">{seat}</span>
                            </div>

                        )
                }
                )
            )}
            </div>
            <div className='selected-info'>
                <strong>Selected Seat:</strong>{selectedSeats.join(', ' || 'None')}
            </div>
        

    </div>
  )
}
