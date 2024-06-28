import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import { useEffect, useState } from "react";
import AccountNavigation from "../AccountNavigation";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
export default function PlacesFormPage() {
    const {id} = useParams();
    // console.log(`id: ${id}`);
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [addedPhotos, setAddedPhotos] = useState([]);

    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(100);

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get(`/places/`+id)
        .then((response) => {
            console.log('place:id',response.data);
            const {title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price} = response.data;
            setTitle(title);
            setAddress(address);
            setAddedPhotos(photos);
            setDescription(description);
            setPerks(perks);
            setExtraInfo(extraInfo);
            setCheckIn(checkIn);
            setCheckOut(checkOut);
            setMaxGuests(maxGuests);
            setPrice(price);
        })
    },[id])
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
    async function savePlace(e) {
        e.preventDefault();
        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        }
        if(id){
            //update
            await axios.put('/places', {
                id,...placeData
            })
        }else{
            //add
            await axios.post('/places',placeData);
        }
        setRedirect(true);
    }
    if(redirect){   
        return <Navigate to={'/account/places'} />
    }
    return (
        <div>
            <AccountNavigation />
            <form onSubmit={savePlace}>
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
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
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
                <div className='grid gap-2 sm:grid-cols-2 md:grid-cols-4'>
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
                    <div>
                        <h3 className='mt-2 -mb-1'>Price per night</h3>
                        <input
                            type='number'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                
                <button className='primary my-4'>Save</button>
            </form>
        </div>
    )
}