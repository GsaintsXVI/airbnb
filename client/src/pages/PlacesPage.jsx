import { useState } from "react";
import {Navigate, Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";

export default function PlacesPage() {
    const { action } = useParams();
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [addedPhotos, setAddedPhotos] = useState([]);

    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState('');

    const titleClass = "text-2xl mt-4";
    const descClass = "text-gray-500 text-sm";

    function inputHeader(text) {
        return <h2 className={titleClass}>{text}</h2>;
    }
    function inputDescription(text) {
        return <p className={descClass}>{text}</p>;
    }
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    async function addNewPlace(e) {
        e.preventDefault();
          await axios.post('/places', {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
        })
        setRedirect('/account/places');
    }
    if(redirect){
        return <Navigate to={redirect} />;
    }
    return (
        <div>
            {action !== "new" && (
                <div className='text-center'>
                    <Link
                        className='inline-flex gap-1 bg-primary text-white rounded-full py-2 px-6'
                        to={"/account/places/new"}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-6'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M12 4.5v15m7.5-7.5h-15'
                            />
                        </svg>
                        Add new place
                    </Link>
                </div>
            )}

            {action === "new" && (
                <div className='text-start'>
                    <form onSubmit={addNewPlace}>
                        {preInput(
                            "Title",
                            "Title for your place. should be short and catchy as in advertisement"
                        )}
                        <input
                            type='text'
                            placeholder='title, for example: My Lovely Apartment'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {preInput("Address", "Address to this place")}
                        <input
                            type='text'
                            placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {preInput("Photos", "more = better")}
                        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                        {preInput("Description", "Short description of the place")}

                        <textarea
                            placeholder='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {preInput("Perks", "select all the perks")}
                        <div className='grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
                            <Perks selected={perks} onChange={setPerks} />
                        </div>
                        {preInput("Extra Info", "House rules, Etc.")}
                        <textarea
                            className=''
                            value={extraInfo}
                            onChange={(e) => setExtraInfo(e.target.value)}
                        />
                        {preInput(
                            "Check in & out times",
                            " Add check in and out times, remember to have some time window for cleaning the room between guests"
                        )}
                        <div className='grid sm:grid-cols-3 gap-2'>
                            <div>
                                <h3 className='mt-2 -mb-1'>Check in Time</h3>
                                <input
                                    type='text'
                                    placeholder='14:00'
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                            </div>
                            <div>
                                <h3 className='mt-2 -mb-1'>Check out Time</h3>
                                <input
                                    type='text'
                                    placeholder='11:00'
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                />
                            </div>
                            <div>
                                <h3 className='mt-2 -mb-1'>Max number of guests</h3>
                                <input
                                    type='number'
                                    value={maxGuests}
                                    onChange={(e) => setMaxGuests(e.target.value)}
                                />
                            </div>
                        </div>
                        <button className='primary my-4'>Save</button>
                    </form>
                </div>
            )}
        </div>
    );
}
