import { useContext, useEffect, useState } from "react";
import {differenceInCalendarDays} from 'date-fns';
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./userContext";

/* eslint-disable react/prop-types */
export function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [redirect,setRedirect] = useState('');
    const { user } = useContext(UserContext);
    useEffect(() => {
        if (user) {
            setFullName(user.name);
            setEmail(user.email);
        }
    })

    async function bookThisPlace(){
        const response =  await axios.post('/bookings', {
            place: place._id,
            checkIn,
            checkOut, 
            numberOfGuests, 
            name:fullName, 
            email, 
            phone,
            price: numberOfNights * place.price
        })   
        const bookingID = response.data._id
        setRedirect(`/account/bookings/${bookingID}`);
    }
    let numberOfNights = 0;
    if(checkIn && checkOut){
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }
    if(redirect){  
        return <Navigate to={redirect} />
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} per night
            </div>
            <div className="border rounded-2xl mt-4">
                <div className="flex">
                    <div className="py-4 px-4 ">
                        <label>Check in: </label>
                        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                    </div>
                    <div className="py-3 px-4 border-l">
                        <label>Check out: </label>
                        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                    </div>
                </div>
                <div className="py-4 px-4 border-t">
                    <label>Number of Guest: </label>
                    <input type="number" value={numberOfGuests} onChange={e => setNumberOfGuests(e.target.value)} />
                </div>
            </div>
            {numberOfNights > 0 && (
                <div className="border-b border-t my-2">
                    <div className="py-3 px-4">
                        <label>Your full name: </label>
                        <input type="text" placeholder="John Smith" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div className="py-3 px-4">
                        <label>Email: </label>
                        <input type="Email" placeholder="JohnSmith@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="py-3 px-4">
                        <label>phone: </label>
                        <input type="tel" placeholder="0123456789" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div className="border-b py-2 text-end">
                        ${numberOfNights * place.price} total
                    </div>
                </div>
                
            )}
            <button onClick={bookThisPlace}className="primary mt-4">
                Book this place 
                {numberOfNights && (
                    <span className="ml-1">${numberOfNights * place.price}</span>
                )}
            </button>
        </div>
    )
}