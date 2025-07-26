import React, { useEffect } from 'react'
import { useState } from 'react'
import '../styles/finalize.css'
import {useNavigate} from 'react-router-dom'

export const Finalize = () => {
    const [paymentMethods, setPaymentMethod] = useState('card')
    const navigate = useNavigate()
    const [cardDetails, setCardDetails] = useState({
        name: '',
        cardnumber:'',
        expiry: '',
        cvv: '',
    })
    const [upiId, setUpiId] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [selectedSeats, setSelectedSeats] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [bookingId, setBookingId] = useState('')

    useEffect(() => {
        setTotalAmount(localStorage.getItem('price') || 0)
        setSelectedSeats(JSON.parse(sessionStorage.getItem('seat')) || [])
        setBookingId(sessionStorage.getItem('bookingId') || '')
      }, [])

    const handleSubmit = (e) => {
        setSuccess(false)
        e.preventDefault()
        try{
            setError('')
            if (paymentMethods === 'card'){
                const {name,cardnumber,expiry,cvv} = cardDetails
                if (!name || !cardnumber || !expiry || !cvv){
                    setError('Enter Valid Card Details')
                    return;
                }

                }else if (paymentMethods === 'upi'){
                    if(!upiId.includes('@')){
                        setError('Enter Valid UPI ID')
                        return;
                    }

                setSuccess(true)
                setTimeout(() => navigate('/p1', { replace: true }), 3000);

            }
        }catch(err){
            setError(err)
        }
    }
  return (
    <div className='container'>
        <h2>Finalize Your Booking</h2>
        <div className='summary'>
            <p><strong>Selected Seats: {selectedSeats.join(', ') || ''}</strong></p>
            <p><strong>Total Amount: ₹{totalAmount}</strong></p>
            <p><strong>Booking Id: {bookingId}</strong></p>
        </div>

        <div className='toggle'>
            <button onClick={() => setPaymentMethod('card')}> 💳 Card</button>
            <button onClick={() => setPaymentMethod('upi')}> <span className='indian-flag-text'>🇮🇳</span> UPI </button>
        </div>

        <form onSubmit={handleSubmit}>
            {paymentMethods==='card' && (
                <>
                    <input type='text' placeholder='Card Number' value={cardDetails.cardnumber} minLength={16} maxLength={16} onChange={(e)=>setCardDetails({ ...cardDetails, cardnumber:e.target.value}) }/>
                    <input type='text' placeholder='CardHolder Name' value={cardDetails.name} onChange={(e)=>setCardDetails({ ...cardDetails, name:e.target.value})}/>
                    <input type='text' placeholder='MM/YY' minLength={5} maxLength={5} value={cardDetails.expiry} onChange={(e)=>setCardDetails({ ...cardDetails, expiry:e.target.value})}/>
                    <input type='password' placeholder='CVV' minLength={3} maxLength={3} value={cardDetails.cvv} onChange={(e)=>setCardDetails({ ...cardDetails, cvv:e.target.value})}/>

                </>
            )}

            {paymentMethods === 'upi' && (
                <input type='text' placeholder='Enter UPI ID (e.g. user@Upi)' value={upiId} onChange={((e)=>setUpiId(e.target.value))}/>
            )}
            {error && <p className='error'>{error}</p>}
            {success ?
            <>
            <p className='success'>Payment Completed</p>
            <p>Redirecting...</p>
            </> : (
                <button type='submit'>Pay ₹{totalAmount}</button>
            )}

        </form>
    </div>
  )
}

